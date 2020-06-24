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
    return -Math.floor(Math.random() * (15000 + 3000))
}


let baseURL = 'https://www.avito.ru/pskov/mototsikly_i_mototehnika?cd=1&radius=100&s=104';
let result = []

let q = tress(function (url, callback) {
    needle.get(url, function (err, res) {
        if (err) throw err
        let $ = cheerio.load(res.body)
        let advertisements = $('.item')

        advertisements.each(function (index) {
            let item = {
                id: $(this).attr('id'),
                name: $(this).find('.snippet-link').attr('title'),
                date: $(this).find('.snippet-date-info').attr('data-tooltip'),
                link: 'https://www.avito.ru' + $(this).find('.snippet-link').attr('href'),
                price: $(this).find('.snippet-price').text().slice(2, -3)
            }
            result.forEach(i=> {
                console.log ('результ id: ' + i.id)
                console.log ('item id: ' + item.id)
                if (i.id !== item.id ) {
                    result.push(item)

                }
            })


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

        callback(null)


    });

}, randomInt())

q.drain = function () {
    console.log('запись в файл...')
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4))
}

q.push(baseURL)


app.listen(3000, () => {
    console.log('Server started')
})
