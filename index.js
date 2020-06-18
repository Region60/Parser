const express = require('express')
const app = express();
const exphbs = require('express-handlebars');
const needle = require('needle');
const tress = require('tress')
const cheerio = require('cheerio')

const hbs = exphbs.create({
    defaultLayout:'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))

app.get('/',(req,res, next) =>{
res.render('index')
})



let URL = 'https://www.avito.ru/pskov/mototsikly_i_mototehnika?cd=1&radius=200&s=104';
let result = []

needle.get(URL, function(err, res){
    if (err) throw err

    let $ = cheerio.load(res.body)
    let a = $('.item ')
    for(key in a) {
       console.log(key)
    };
console.log(a.length)

    /*console.log(res.body);
    console.log(res.statusCode);*/
})












app.listen(5000, ()=>{
    console.log('Server started')
});
