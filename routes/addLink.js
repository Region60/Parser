const {Router} = require('express')
const router = Router()
const Request =require('../models/request')

router.get('/', (req, res) => {
    res.render('index', {
        title: "Главнаая страница",
        isHome: true
    })
})

router.post('/', async (req, res) => {
    const request = new Request({
        url: req.body.link
    })
    try {
        console.log('save')
        await request.save()
    } catch (e) {
            console.log(e)
    }


    /*console.log(req.body)
    console.log("TEXT")*/
})

module.exports = router