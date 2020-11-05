const tress = require('tress')
const bot = require('../telegramBot/telegramBot')
const needle = require('needle');
const cheerio = require('cheerio')
const getResult = require('./getResult')
const getNameFile = require('./getNameFile')
const fs = require('fs')

//рандомная задержка
let randomInt = () => {
    return -Math.floor(Math.random() * (7000 + 3000))
}

let q = tress(crawl, randomInt())

//urlHomePage = (res.headers['x-frame-options'].slice(11))
let paginatorStr = '.pagination-item-1WyVp'
let activPageStr = '.pagination-item_active-25YwT'
let httpOptions = {}
let result = []
let urlHomePage = 'https://www.avito.ru/'
let sCookie = 'https://www.avito.ru/pskov'
let URL = ''
let telegramID = ''

let startCr = (selector, telegramId) => {
    if(typeof selector === 'string') {
        telegramID = telegramId
        URL = selector
        getResult(getNameFile(selector))
        q.push(selector)
    }else{
        q.kill()
    }
}

//инициализация и обработка редиректа
needle.get(sCookie, function (err, res) {
    if (err || res.statusCode !== 200)
        throw err || res.statusCode
    //установка куки
    httpOptions.cookies = res.cookies
//запуск краулинга
})

let addPageOfPaginator = ($) => {
    let paginator = $(paginatorStr)
    let activPage = $(activPageStr)
    //console.log('активная страница: ' + activPage.text())
    if (activPage.text() === '1') {
        let getCountPage = paginator.length - 2       //узнаем колисество страниц в паджинаторе
        let pageCount = (paginator[getCountPage].children[0].data)
        //console.log('кол-во страниц: ' + pageCount)
        for (let i = 2; i < +pageCount + 1; i++) {
            //console.log('добавлена в очередь страница: ' + URL + '&p=' + i)
            q.push(URL + '&p=' + i)
        }
    }
}

function crawl(url, callback) {
    //q.pause()
    needle.get(url, function (err, res) {
        if (err) throw err
        let $ = cheerio.load(res.body)
        let advertisements = $('.item_table')
        advertisements.each(function (index) {
            let item = {
                id: $(this).attr('id'),
                name: $(this).find('.snippet-link').attr('title'),
                date: $(this).find('.snippet-date-info').attr('data-tooltip'),
                link: 'https://www.avito.ru' + $(this).find('.snippet-link').attr('href'),
                price: $(this).find('.snippet-price').text().slice(2, -3)
            }

            if (result.length === 0) {
                result.push(item)
            } else {
                //если в массиве объявления с id и name такими как item
                if (!result.find(i => i.id === item.id)
                ) {
                    result.push(item)
                    //bot.sendMessage(telegramID, item.link);
                }
            }
        })
        addPageOfPaginator($)
        console.log('объявлений:' + result.length)
        console.log('status code ' + res.statusCode)
        callback()
    });
}

q.drain = () => {
    fs.writeFileSync(`./data/${getNameFile(URL)}.json`, JSON.stringify(result, null, 4))
        console.log('The End')
}

module.exports = startCr