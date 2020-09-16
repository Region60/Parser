 function resRender(req,res,next) {
     res.render('index', {
         title: "Главнаая страница",
         isHome: true
     })
next()
}
module.exports = resRender