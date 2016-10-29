'use strict';
const router = require('express').Router();
module.exports = router;

const User = require('../../../db/models/user');
const Drawing = require('../../../db/models/drawing');
const Project = require('../../../db/models/project');


router.get('/:facebook_id', (req, res, next) => {
    User.findOne({
        where: { facebook_id: req.params.facebook_id },
        include: { model: Project }
    })
        .then(user => {
            return user.getProjects({ include: { model: Drawing }});
        })
        .then(projects => {
            let projectsArray = projects.map(project => project.dataValues);
            res.send(projectsArray);
        })
        .catch(next);
});


router.post('/favorite', (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            // if (true) {
                user.favorites = [4];
                console.log('FAVORITES*****************************\n\n', user.favorites);
                return user.save()
            // }
        })
        .then(user => {
            console.log('USER*****************************\n\n', user);
            user.decrement('n_likes');
            res.send(user);
        })
        .catch(next);
} )


router.post('/register', function (req, res, next) {
    User.findOrCreate({
        where: {username: req.body.name, facebook_id: req.body.id}})
        .spread((createdUser, isCreated) => {
            // req.session.user = createdUser.dataValues;
            res.send({user: createdUser.dataValues, isCreated: isCreated});
        })
        .catch(next);
});


