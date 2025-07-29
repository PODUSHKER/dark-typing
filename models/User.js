const {sequelize, DataTypes} = require('../utils/dbSettings.js')


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    averageSpeed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    averageAccuracy: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    isAccept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})


module.exports = User