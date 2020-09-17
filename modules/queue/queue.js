const tress = require('tress')
const bot = require('../telegramBot/telegramBot')
//const homeRoutes = require('./routes/home')
const needle = require('needle');
const cheerio = require('cheerio')
const fs = require('fs')
const resRender = require('../../middleware/resultRender')

//рандомная задержка
let randomInt = () => {
    return -Math.floor(Math.random() * (7000 + 3000))
}

let q = tress(crawl, randomInt())

//urlHomePage = (res.headers['x-frame-options'].slice(11))

//Куки
let httpOptions = {}

//массив с объявами
let result = []
let urlHomePage = 'https://www.avito.ru/'
let sCookie = 'https://www.avito.ru/pskov'
let URL = urlHomePage + 'pskov/mototsikly_i_mototehnika?cd=1&pmax=150000&pmin=50000&radius=300&s=104&proprofile=1';

let startCr = (addUrl) =>
    q.push(addUrl)

//инициализация и обработка редиректа
needle.get(sCookie, function (err, res) {
    fs.readFile('./data/data.json', function (error, data) {
        result = JSON.parse(data)
    });
    if (err || res.statusCode !== 200)
        throw err || res.statusCode
    //установка куки
    httpOptions.cookies = res.cookies
//запуск краулинга
})

let addPageofPaginator = ($) => {
    let paginator = $('.pagination-item-1WyVp')
    let activPage = $('.pagination-item_active-25YwT')
    //console.log('активная страница: ' + activPage.text())
    if (activPage.text() === '1') {
        let pageCount = (paginator[7].children[0].data)
        // console.log('кол-во страниц: ' + pageCount)
        for (let i = 2; i < +pageCount + 1; i++) {
            //  console.log('добавлена в очередь страница: ' + URL + '&p=' + i)
            q.push(URL + '&p=' + i)
        }
    }
}

function saveResult() {
    fs.writeFileSync('./data/data.json', JSON.stringify(result, null, 4))
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
                    //bot.sendMessage(1322775332, item.link);
                }
            }
        })
        addPageofPaginator($)
        console.log('объявлений:' + result.length)
        console.log('status code ' + res.statusCode)
        callback()
    });
}


q.drain = () => {
    saveResult()
    console.log('The End')

}



module.exports = startCr