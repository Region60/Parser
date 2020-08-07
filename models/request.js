const {Schema, model} = require('mongoose')

const request = new Schema ({
    url: {
        type: String,
        required: true
    }
})

module.exports = model('Request', request)