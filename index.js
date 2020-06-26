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

//рандомная задержка
let randomInt = () => {
    return -Math.floor(Math.random() * (1000 + 1000))
};

//запуск очереди
//let q = tress(crawl, 10)


//Куки
let httpOptions = {};

//массив с объявами
let result = []
let urlHomePage = 'https://www.avito.ru/'
let sCookie = 'https://www.avito.ru/pskov'
let URL = urlHomePage + 'pskov/mototsikly_i_mototehnika?cd=1&radius=200&s=104';

/*needle.get('https://www.avito.ru/pskov',async function (err, res) {
    if (res.statusCode === 200) {   //если код ответа 200 то
      await  sCookie = urlHomePage + 'pskov'
        console.log ('если код 200 то адрес: '+sCookie)
    }else if (res.statusCode === 302) {
         urlHomePage = (res.headers['x-frame-options'].slice(11))
        sCookie = urlHomePage + 'pskov'
        console.log ('если код 302 то адрес: '+sCookie)
    }
})*/

console.log ('запрос кукков с адреса: ' + sCookie)


let   req = needle.get (sCookie, {follow_max: 3}, function (err,resp) {

    req.on('redirect', function(url) {
        let urll = url
        console.log('urrrrl: ' + urll)
    })
})





//инициализация и обработка редиректа
/*
needle.get(sCookie, function (err, res) {
    if (err || res.statusCode !== 200)
        throw err || res.statusCode
    //установка куки
    httpOptions.cookies = res.cookies
//запуск краулинга
    q.push(URL)
});

//парсинг
function crawl(url, callback) {
    needle.get(url, function (err, res) {
/!*
        console.log(res.headers)
*!/

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
                //console.log('массив пустой')
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
        //console.log('активная страница: ' + activPage.text())
        if (activPage.text() === '1') {
            let pageCount = (paginator[7].children[0].data)

            console.log('кол-во страниц: ' + pageCount)

            for (let i = 2; i < +pageCount + 1; i++) {
                console.log('добавлена в очередь страница: ' + URL + '&p=' + i)
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
    fs.writeFileSync('./data.json', JSON.stringify(result, null, 4))
}
*/

app.listen(3000, () => {
    console.log('Server started')
})
