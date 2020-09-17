const express = require('express')
const app = express();
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const csrf = require('csurf')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const homeRouters = require('./routes/home')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const keys = require('./keys/index')

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify:false,
            useUnifiedTopology:true
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

app.use("/", homeRouters)
app.use("/auth", authRoutes)

