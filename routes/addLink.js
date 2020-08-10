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
        url: req.body.link,
        requestId: req.user  //в схеме указали ObjectId и монгуст поймет что надо использовать поле _id
    })
    try {
        console.log('save')
        await request.save()
        res.redirect('/')
    } catch (e) {
            console.log(e)
    }


    /*console.log(req.body)
    console.log("TEXT")*/
})

module.exports = router