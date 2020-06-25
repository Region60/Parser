const express = require('express')
const app = express();
const exphbs = require('express-handlebars');
const needle = require('needle');
const tress = require('tress')
const cheerio = require('cheerio')

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

let randomInt = () => {
    return -Math.floor(Math.random() * (14000 + 3000))
}

let q = tress(crawl, randomInt())


let baseURL = 'https://www.avito.ru/pskov/mototsikly_i_mototehnika?cd=1&radius=200&s=104';
let sCookie = 'https://www.avito.ru/pskov'
let httpOptions = {}
let result = []

//инициализация
needle.get(sCookie, function (err, res) {
    if (err || res.statusCode !== 200)
        throw err || res.statusCode
    //установка куки
    httpOptions.cookies = res.cookies
//запуск краулинга
    q.push(baseURL)


})

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
                console.log('массив пустой')
                result.push(item)
            } else {
                if (result.find(i => i.id !== item.id)
                    && result.find(i => i.name !== item.name)
                ) {
                    result.push(item)

                }
            }
        })

        let paginator = $('.pagination-item-1WyVp')
        let activPage = $('.pagination-item_active-25YwT')
        console.log('активная страница: ' + activPage.text())
        if (activPage.text() === '1') {
            let pageCount = (paginator[7].children[0].data)

            console.log('кол-во страниц: ' + pageCount)

            for (let i = 2; i < +pageCount + 1; i++) {
                console.log('добавлена в очередь страница: ' + baseURL + '&p=' + i)
                q.push(baseURL + '&p=' + i)
            }
        }


        console.log('объявлений:' + result.length)
        console.log('status code' + res.statusCode)

        callback()


    });

}

q.drain = function () {
    console.log('запись в файл...')
    fs.writeFileSync('./data.json', JSON.stringify(result, null, 4))
}

app.listen(3000, () => {
    console.log('Server started')
})
