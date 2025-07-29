const Message = require('./Message.js')
const User = require('./User.js')
const Result = require('./Result.js')
const Mail = require('./Mail.js')


User.hasMany(Message, {onDelete: 'CASCADE'})
Message.belongsTo(User, {onDelete: 'CASCADE'})

User.hasMany(Result, {onDelete: 'CASCADE'})
Result.belongsTo(User, {onDelete: 'CASCADE'})

User.hasOne(Mail, {onDelete: 'CASCADE'})
Mail.belongsTo(User, {onDelete: 'CASCADE'})

module.exports = { User, Message, Result, Mail }