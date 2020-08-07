const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: "Главнаая страница"
    })
})

router.post('/', async (req, res) => {
    const request = new Request({
        url: req.body.link
    })
    try {
        await request.save()
    } catch (e) {
            console.log(e)
    }


    /*console.log(req.body)
    console.log("TEXT")*/
})

module.exports = router