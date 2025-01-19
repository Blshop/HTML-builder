const readline = require('readline')
const fs = require('fs')
const path = require('path')
const fileName = 'text.txt'
const pathToFile = path.join(__dirname, fileName)

const ws = fs.createWriteStream(pathToFile, { flags: 'a', encoding: 'utf8' })


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function writeToFile() {
    rl.question('Please enter any text: ', (input) => {
        if (input.trim() === "exit") {
            ws.end()
            rl.close()
        }
        else {
            ws.write(input + '\n')
            writeToFile()
        }
    })
}

writeToFile()

rl.on('close', () => { console.log('\n Operation successfully ended!') });