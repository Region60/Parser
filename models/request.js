const {Schema, model} = require('mongoose')

const request = new Schema ({
    url: {
        type: String,
        required: true
    },
    requestId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Request', request)