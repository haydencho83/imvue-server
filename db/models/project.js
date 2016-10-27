'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('project', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    latitude: {
        type: Sequelize.FLOAT
    },
    longitude: {
        type: Sequelize.FLOAT
    },
    angle: {
        type: Sequelize.FLOAT
    },
    tilt: {
        type: Sequelize.FLOAT
    }
});