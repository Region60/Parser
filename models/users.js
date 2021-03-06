const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    telegramId: {
        type: String,
        required: true
    },
    permission: {
        type: Boolean,
        required: true
    }
})

module.exports = model('User', userSchema)