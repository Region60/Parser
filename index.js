const express = require('express')
const app = express();
const exphbs = require('express-handlebars');
const needle = require('needle');
const tress = require('tress')
const cheerio = require('cheerio')
const telegramBot = require ('./modules/telegramBot/telegramBot')


const path = require('path')
const fs = require('fs')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))

app.get('/', (req, res, next) => {
    res.render('index')
})

//рандомная задержка
let randomInt = () => {
    return -Math.floor(Math.random() * (7000 + 3000))
};

//запуск очереди
let q = tress(crawl, randomInt())

//Куки
let httpOptions = {}

//массив с объявами
let result = []
let urlHomePage = 'https://www.avito.ru/'
let sCookie = 'https://www.avito.ru/pskov'
let URL = urlHomePage + 'pskov/mototsikly_i_mototehnika?cd=1&radius=200&s=104';

//urlHomePage = (res.headers['x-frame-options'].slice(11))



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
    q.push(URL)
})

console.log( 'в массиве: ' + result.length + 'объявлений')

//парсинг

function crawl(url, callback) {
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
                    console.log (item)
                    result.push(item)
                    console.log('добавленно объявлние: ' + item.name)
                }
            }
        })

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

        console.log('объявлений:' + result.length)
        console.log('status code ' + res.statusCode)

        callback()
    });
}


q.drain = function () {
    //console.log('запись в файл...')
    fs.writeFileSync('./data/data.json', JSON.stringify(result, null, 4))
    console.log('The End')
}

app.listen(3000, () => {
    console.log('Server started')
})
