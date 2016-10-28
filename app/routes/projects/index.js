'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Project = require('../../../db/models/project');
const Drawing = require('../../../db/models/drawing');
// const Text = require('../../../db/models/text.js');
// const Image = require('../../../db/models/image.js');
const User = require('../../../db/models/user');
const PROJECT_RANGE = require('./range.js');


router.get('/all', (req, res, next) {
    Project.findAll()
        .then(projects => res.send(projects))
        .catch(next);
});


router.get('/:projectId', (req, res, next) => {
    Project.findOne(
        {
            where: { id: req.params.projectId },
            include: [{model: Drawing}, {model: User}]
        })
        .then(project => res.send(project))
        .catch(next);
});



router.get('/:lat/:lng', (req, res, next) => {
    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lng);

    Project.findAll({
            where: {
                $and: [
                    { latitude: { $between: [lat - PROJECT_RANGE.inboxRange, lat + PROJECT_RANGE.inboxRange] } },
                    { longitude: { $between: [lon - PROJECT_RANGE.inboxRange, lon + PROJECT_RANGE.inboxRange] } }
                ]
            },
            include: [
                { model: Drawing },
                { model: User }
            ]
        })
        .then(drawing => res.send(drawing))
        .catch(next);
});


router.get('/map/:lat/:lng', (req, res, next) => {

    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lng);

    Project.findAll({
            where: {
                $and: {
                    latitude: {
                        $between: [lat - PROJECT_RANGE.mapRange, lat + PROJECT_RANGE.mapRange]
                    },
                    longitude: {
                        $between: [lon - PROJECT_RANGE.mapRange, lon + PROJECT_RANGE.mapRange]
                    }
                }
            },
            include: [
                { model: Drawing },
                { model: User }
            ]
        })
        .then(allInfo => res.send(allInfo))
        .catch(next);
});

router.get('/:userId', (req, res, next) => {
    Project.findAll({
            where: {
                userId: req.params.userId
            }
        })
        .then(userProjects => res.send(userProjects))
})


router.post('/:projectId/favorite', (req, res, next) => {
    Project.findById(req.params.projectId)
        .then(project => project.increment('likes', { by: 1 }))
        .then(project => res.send(project))
        .catch(next);
})


router.post('/:projectId/dislike', (req, res, next) => {
    Project.findById(req.params.projectId)
        .then(project => project.decrement('likes', { by: 1 }))
        .then(project => res.send(project))
        .catch(next);
})




router.post('/:lat/:lng/:ang/:tilt', (req, res, next) => {

    Project.create({
            title: req.body.text.title,
            description: req.body.text.description,
            latitude: req.params.lat,
            longitude: req.params.lng,
            angle: req.params.ang,
            tilt: req.params.tilt,
            userId: req.body.user.id
        })
        .then((project) => {

            var creatingAll = [];

            if (req.body.drawing.image.length) {
                req.body.drawing.projectId = project.id;
                creatingAll.push(Drawing.create(req.body.drawing));
            }

            // if (req.body.texts.length) {
            //     for (let i = 0; i < req.body.texts.length; i++) {
            //         req.body.texts[i].projectId = project.id;
            //         creatingAll.push(Text.create(req.body.texts[i]));
            //     }
            // }

            // if (req.body.images.length) {
            //     for (let i = 0; i < req.body.images.length; i++) {
            //         req.body.images[i].projectId = project.id;
            //         creatingAll.push(Image.create(req.body.images[i]));
            //     }
            // }

            return Promise.all(creatingAll); // eslint-disable-line new-cap
        })
        .then(() => res.sendStatus(201))
        .catch(next);
});