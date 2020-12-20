function getNameFile(url) {
    let nameFileFirstParts = url.slice(21).split('/')


    if (nameFileFirstParts.length === 2) {
        nameFileFirstParts = nameFileFirstParts[0]
    }else {
        nameFileFirstParts = url.slice(21).split('/').slice(0, 2).join('-')
    }
    function name() {
        let nameFileSecondParts = url.slice(21).split('/').pop()
        if (nameFileSecondParts.includes('-')) {
            return nameFileSecondParts.split('-')[0]
        } else {
            return nameFileSecondParts.split('?')[0]
        }
    }

    return (nameFileFirstParts +'-'+ name())
}

module.exports = getNameFile