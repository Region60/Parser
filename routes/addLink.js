const{Router} = require('express')
const router = Router()

router.get('/',(req,res) => {
        res.render('index', {
                title: "Главнаая страница"
        })
})

router.post('/', (req, res) => {
        console.log(req.body)
        console.log("TEXT")
})

module.exports = router