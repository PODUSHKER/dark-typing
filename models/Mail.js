const { sequelize, DataTypes } = require('../utils/dbSettings.js')
const Sequelize = require('sequelize')

const Mail = sequelize.define('Mail', {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    }
})


module.exports = Mail