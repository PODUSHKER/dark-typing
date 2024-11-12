const Message = require('./Message.js')
const User = require('./User.js')
const Result = require('./Result.js')


User.hasMany(Message)
Message.belongsTo(User)

User.hasMany(Result)
Result.belongsTo(User)

module.exports = { User, Message, Result }