const tress = require('tress')
const bot = require('../telegramBot/telegramBot')
const needle = require('needle');
const cheerio = require('cheerio')
const fs = require('fs')

//рандомная задержка
let randomInt = () => {
    return -Math.floor(Math.random() * (7000 + 3000))
}

let q = tress(crawl, randomInt())

//urlHomePage = (res.headers['x-frame-options'].slice(11))

let httpOptions = {}
let result = []
let urlHomePage = 'https://www.avito.ru/'
let sCookie = 'https://www.avito.ru/pskov'
let namesFile = ''
let URL = ''
let telegramID = ''

let startCr = (addUrl, telegramId) => {
    telegramID = telegramId
    URL = addUrl
    getResult(addUrl)
    q.push(addUrl)
}
function getResult(url) {
    function readFile () {
        fs.readFile(`./data/${getNameFile(url)}.json`, function (error, data) {
            result = JSON.parse(data)
        })
    }
    if(fs.existsSync(`./data/${getNameFile(url)}.json`)){
        readFile()
    }else {
        fs.writeFileSync(`./data/${getNameFile(url)}.json`, '[]')
        readFile()

    }

}

function getNameFile (url) {
  let nameFile = url.slice(21).split('/').slice(0,2).join('_')
    return nameFile
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
    let paginator = $('.pagination-item-1WyVp')
    let activPage = $('.pagination-item_active-25YwT')
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