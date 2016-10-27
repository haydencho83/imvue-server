'use strict'
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const db = require('./db');
const User = db.model('user');
const Drawing = db.model('drawing');
// const Text = db.model('text');
// const Image = db.model('image');
const Project = db.model('project');
const Promise = require('sequelize').Promise;

/* seed data */
const users = [
  {username: 'Obama', email: 'obama@gmail.com', password: 'potus'},
  {username: 'Han', email: 'han@gmail.com', password: 'han1234'}
];


// const texts = [
//   {font: 'serif', size: 32, color: 'black', x: 843, y: 357, content: 'Hello World'},
//   {font: 'Arial', size: 40, color: 'black', x: 478, y: 290, content: 'Awesome'},
//   {font: 'Verdana', size: 144, color: 'black', x: 816, y: 765, content: 'Awesome'},
//   {font: 'serif', size: 60, color: 'red', x: 50, y: 700, content: 'Fullstack was founded in 2012!'},
//   {font: 'serif', size: 70, color: '#33FF49', x: 150, y: 300, content: 'Welcome to LuckyPub!'},
//   {font: 'serif', size: 70, color: '#33FF49', x: 150, y: 550, content: 'Show @ bar for BOGO!'},
//   {font: 'serif', size: 70, color: '#33FF49', x: 150, y: 550, content: 'Unscramble the letters on the north'},
//   {font: 'serif', size: 70, color: '#33FF49', x: 150, y: 550, content: 'side of Wash Square Arch for the next clue!'},
// ];

const drawings = [
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
];

// const images = [
//   {source: 'img/cat.png', x: 126, y: 40},
//   {source: 'img/waldo.png', x: 153, y: 143},
//   {source: 'img/obama.png', x: 119, y: 200},
//   {source: 'img/light_bulb.png', x: 250, y:150},
//   {source: 'img/2D_Barcode.png', x: 250, y:150}
// ];

var projects = [
  {title: 'awesome Project', description: `dable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem`, likes: 99, latitude: 40.7600170509765, longitude: -73.9686568492569, angle: 179, tilt: 78},
  {title: 'amazing Project', description: `dable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem`, likes: 35, latitude: 40.7600030512509, longitude: -73.968616960078, angle: 217, tilt: -9}
];



let seedUsers = function(){
  let creatingUsers = users.map(user => User.create(user));
  return Promise.all(creatingUsers);
};

let seedProjects = (createdUsers) => {
  let creatingProjects = projects.map( project => {
                            project.userId = _.sample(createdUsers).id;
                            return Project.create(project)
                         });

  return Promise.all(creatingProjects)

};

// let seedTexts = (createdProjects) => {
//   let creatingTexts = texts.map( text => {
//                         text.projectId = _.sample(createdProjects).id;
//                         return Text.create(text);
//                       })
//   return Promise.all(creatingTexts);
// };

let seedDrawings = (createdProjects) => {
  let creatingDrawings = drawings.map( drawing => {
                            drawing.projectId = _.sample(createdProjects).id;
                            return Drawing.create(drawing);
                        })
  return Promise.all(creatingDrawings);
};

// let seedImages = (createdProjects) => {
//   let creatingImages = images.map( image => {
//                             image.projectId = _.sample(createdProjects).id;
//                             return Image.create(image);
//                         })
//   return Promise.all(creatingImages);
// };




db.sync({force: true})
  .then(() => {
    return seedUsers();
  })
  .then((createdUsers) => {
      return seedProjects(createdUsers);
  })
  .then((createdProjects) => {
    return Promise.all([
      // seedTexts(createdProjects), seedImages(createdProjects),
      seedDrawings(createdProjects)])
  })
  .then(() => {
      console.log(chalk.green('Seed successful!'));
      process.exit(0);
  })
  .catch((err) => {
      console.error(err);
      process.exit(1);
  });