const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    telegrammId: {
        type: String,
        required: true
    },
    permission: {
        type: Boolean,
        required: true
    }
})

module.exports = model('User', userSchema)