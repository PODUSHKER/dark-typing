const mongoose = require('mongoose')
const User = require('./User.js')

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    errors: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
}, {timestamps: true})

const Result = mongoose.model('Result', resultSchema)

module.exports = Result