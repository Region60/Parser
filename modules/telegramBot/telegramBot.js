let TelegramBot = require('node-telegram-bot-api')

let token = '1391504701:AAFqnSOwLWQWCoqy__13nQY1TkRE2DJv34U'
let bot = new TelegramBot(token, {polling: true})

bot.onText(/go (.+)/, function (msg, match) {
    let fromId = msg.from.id; // Получаем ID отправителя
    let resp = match[1]; // Получаем текст после /echo
    bot.sendMessage(fromId, 'вроде работаю');
});

// Простая команда без параметров
bot.on('message', function (msg) {
    let chatId = msg.chat.id; // Берем ID чата (не отправителя)
    // Фотография может быть: путь к файлу, поток (stream) или параметр file_id
    /*let photo = 'cats.png'; // в папке с ботом должен быть файл "cats.png"
    bot.sendPhoto(chatId, photo, { caption: 'Милые котята' });*/
});

module.exports = bot