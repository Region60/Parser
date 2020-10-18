const {Router} = require('express')
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const key = require('../keys')
const regEmail = require('../emails/registratrion')
const resetEmail = require('../emails/reset')
const router = Router()

sgMail.setApiKey(key.SENDGRID_API_KEY)

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
            await sgMail.send(regEmail(email))
                .then(() => {
                }, error => {
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

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,   //Ищем пользователя с токеном и с датой больше now, иначе юзер не будет найден
            resetTokenExp: {$gt: Date.now()}
        })
        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(), //передаем параметры userId, token
                token: req.params.token
            })
        }

    } catch (e) {
        console.log(e)
    }


})

router.post('/reset', async (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', "Что-то пошло не так, повторите попытку позже")
                return res.redirect('auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})
            if (candidate) {
                candidate.resetToken = token    // присвоить токен
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000  //задать время жизни токена
                await candidate.save()
                await sgMail.send(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined //удаляем токен
            user.resetTokenExp = undefined //удаляем токен
await user.save(
    res.redirect('/auth/login')
)
        } else {
            req.flash('Время жизни токена истекло')
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router