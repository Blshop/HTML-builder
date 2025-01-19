const readline = require('readline')
const fs = require('fs')
const path = require('path')
const fileName = 'text.txt'
const pathToFile = path.join(__dirname, fileName)

const ws = fs.createWriteStream(pathToFile, 'utf8')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Please enter any text: ', (input) => {
    ws.write(input)
    ws.end()
    rl.close()
})
