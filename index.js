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

let randomInt =()=> {
    return Math.floor(Math.random() * 10000)
}


let baseURL = 'https://www.avito.ru/pskov/mototsikly_i_mototehnika?cd=1&radius=200&s=104';
let result = []

let q = tress(function (url, callback) {
    needle.get(url, function (err, res) {
        if (err) throw err
        let $ = cheerio.load(res.body)
        let a = $('.item')

        a.each(function (index) {
            let item = {
                id: $(this).attr('id'),
                name: $(this).find('.snippet-link').attr('title'),
                date: $(this).find('.snippet-date-info').attr('data-tooltip'),
                link: 'https://www.avito.ru' + $(this).find('.snippet-link').attr('href'),
                price: $(this).find('.snippet-price').text().slice(2, -3)
            }
            result.push(item)

        })

            console.log ($('.pagination-item_active-25YwT').text())

        //let pageCount = $('.pagination-item-1WyVp').text().slice(15, -7)

        /*for( let i = 1; i < pageCount+1; i++) {
            //q.push(baseURL + '&p=' + i)
        }*/

        //console.log(pageCount)
        //console.log(result)
        console.log(res.statusCode)
    })

    callback()
}, 1)
q.push(baseURL)

app.listen(3000, () => {
    console.log('Server started')
});
