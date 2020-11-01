const fs = require('fs')


//берет содержимое файла
function getResult(nameFile) {
    function readFile () {
        fs.readFile(`./data/${nameFile}.json`, function (error, data) {
            result = JSON.parse(data)
        })
    }
    if(fs.existsSync(`./data/${nameFile}.json`)){
        readFile()
    }else {
        fs.writeFileSync(`./data/${nameFile}.json`, '[]')
        readFile()

    }

}
module.exports = getResult