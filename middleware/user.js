const User = require('../models/users')

module.exports = async function(req,res,next) {
    try {
        const user = await User.findById('5f31b6ab44c7463190f185d4')
        req.user = user
        next()
    }
    catch (e) {
        console.log(e)
    }
}
