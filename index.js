const express = require('express')
const app = express();
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const csrf = require('csurf')
const MongoStore = require('connect-mongodb-session')(session)
const needle = require('needle');
const tress = require('tress')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const bot = require('./modules/telegramBot/telegramBot')
const homeRoutes = require('./routes/home')
const addLinkRoutes = require('./routes/addLink')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const keys = require('./keys/index')
const path = require('path')
const fs = require('fs')




async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify:false
        })
        app.listen(3000, () => {
            console.log('Server started')
        })
    } catch (e) {
        console.log(e)
    }

}
start()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI

})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)

app.use("/", addLinkRoutes)
app.use("/auth", authRoutes)

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
let URL = urlHomePage + 'pskov/mototsikly_i_mototehnika?cd=1&pmax=150000&pmin=50000&radius=300&s=104&proprofile=1';


//urlHomePage = (res.headers['x-frame-options'].slice(11))

let startCr = () =>
    q.push(URL)
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
    startCr()
})


//парсинг

function crawl(url, callback) {
    q.pause()
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
                    //console.log (item)
                    result.push(item)
                    //bot.sendMessage(1322775332, item.link);
                    // console.log('добавленно объявлние: ' + item.name)
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
    //setTimeout( startCr, 600000    )
}


