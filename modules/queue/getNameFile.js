function getNameFile (url) {
    let nameFile = url.slice(21).split('/').slice(0,2).join('_')

    function name () {
        let nameFile1 = url.slice(21).split('/').pop()
        if(nameFile1.includes('-')){
            return nameFile1.split('-')[0]
        }else {
            return nameFile1.split('?')[0]
        }
    }

    return (nameFile +'_' + name())
}

module.exports = getNameFile