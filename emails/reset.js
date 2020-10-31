const keys = require('../keys')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Восстановление доступа',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<div style="border: solid; border-radius:4px; min-width: 400px; max-width: 500px; padding: 10px">
        <h1>ВЫ забыли пароль?</h1>
        <p>Если нет, то просто проигнорируйте это письмо</p>
        <p>Иначе нажмите на ссылку ниже:</p> 
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
</div> `
    }
}