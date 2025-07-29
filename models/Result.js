const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mistakes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accuracy: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    language: {
        type: DataTypes.CHAR(10),
        allowNull: false
    },
})
//user
module.exports = Result
