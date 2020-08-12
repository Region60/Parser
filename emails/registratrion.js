const key = require('../keys')


module.exports = function (email) {
    return {
        to: 'test@example.com',
        from: 'test@example.com',
        subject: 'Фккаунт создан',
        html: `
    <h1>Добро пожаловать нв приложение Parser Avito</h1>
    <p>Вы успешно создали аккаунт с email{email}</p>
    <hr/>
    <a href="${key.BASE_URL}">Parser Avito</a>
    `
    }
}