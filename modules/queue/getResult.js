const fs = require('fs')


//берет содержимое файла
function getResult(nameFile) {
    let result = []
    function readFile () {
        let data = fs.readFileSync(`./data/${nameFile}.json`,"utf-8")
            result = JSON.parse(data)
        }

    if(fs.existsSync(`./data/${nameFile}.json`)){
        console.log('файл есть')
        readFile()
    }else {
        fs.writeFileSync(`./data/${nameFile}.json`, '[]')
        console.log('файла нету')
        readFile()

    }
    console.log("файл прочитан, в нем " + result.length + " объявлений/я")
return result
}
module.exports = getResult