const sequelize = require('sequelize');

const connection = new sequelize('nodejs', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;