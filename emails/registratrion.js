const key = require('../keys')


module.exports = function (email) {
    return {
        to: email,
        from: '_max_kot@mail.ru',
        subject:'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    }
}