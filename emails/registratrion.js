const key = require('../keys')


module.exports = function (email) {
    return {
        to: email,
<<<<<<< HEAD
        from: key.EMAIL_FROM,
        subject:'Регистрация на Parser',
        text: 'text',
        html: `<div style="border: solid; border-radius:4px; min-width: 400px; max-width: 500px; padding: 10px"><h1>Подтверждение регистрации</h1>
<p>Вы успешно создали аккаунт с email - ${email}</p>
<hr />
<a href="http://localhost:3000/auth/login#login">Parser</a></div>`
=======
        from: 'maximkotov1986@gmail.com',
        subject:'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
>>>>>>> origin/master
    }
}