const {Router} = require('express')

/*const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')*/
const sgMail = require('@sendgrid/mail');

const bcrypt = require('bcryptjs')
const User = require('../models/users')
const key = require('../keys')
const regEmail = require('../emails/registratrion')
const router = Router()

/*
const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: key.SENDGRID_API_KEY
    }
}))
*/
sgMail.setApiKey(key.SENDGRID_API_KEY)

const msg = {
    to: 'test@example.com',
    from: '_max_kot@mail.ru',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError')

    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                const user = await User.findById('5f31b6ab44c7463190f185d4')
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')

                })
            } else {
                req.flash('loginError', 'Не верный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name, telegramId} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, telegramId, permission: true
            })
            await user.save()
            res.redirect('/auth/login#login')
            await sgMail.send(msg)
                .then(() => {}, error => {
                    console.error(error);

                    if (error.response) {
                        console.error(error.response.body)
                    }
                });
        }
    } catch (e) {
        console.log(e)
    }
})


module.exports = router