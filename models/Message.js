const {sequelize, DataTypes} = require('../utils/dbSettings.js')





const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    text: {
        type: DataTypes,
        allowNull: false
    }
})
//from 

module.exports = Message;
