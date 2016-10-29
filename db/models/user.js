
'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING
    },
    salt: {
        type: Sequelize.STRING
    },
    facebook_id: {
        type: Sequelize.STRING
    },
    google_id: {
        type: Sequelize.STRING
    },
    favorites: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    n_likes: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        validate: {
            max: 5,
            min: 0
        }
    }
}, {
    instanceMethods: {
        sanitize: function() {
            return _.omit(this.toJSON(), ['password', 'salt']);
        },
        correctPassword: function(candidatePassword) {
            return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
        }
    },
    classMethods: {
        generateSalt: function() {
            return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function(plainText, salt) {
            var hash = crypto.createHash('sha1');
            hash.update(plainText);
            hash.update(salt);
            return hash.digest('hex');
        }
    },
    hooks: {
        beforeCreate: setSaltAndPassword,
        beforeUpdate: setSaltAndPassword
    }
});

function setSaltAndPassword(user) {
    if (user.changed('password')) {
        user.salt = user.Model.generateSalt();
        user.password = user.Model.encryptPassword(user.password, user.salt);
    }
}