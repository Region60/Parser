const key = require('../keys')


module.exports = function (email) {
    return {
        to: email,
        from: 'maximkotov1986@gmail.com',
        subject:'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    }
}