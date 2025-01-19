const fs = require('fs')
const path = require('path')
const fileName = 'text.txt'
const pathToFile = path.join(__dirname, fileName)

const rs = fs.createReadStream(pathToFile, 'utf8')
rs.on('data', data => console.log(data))
rs.on('end', () => console.log('Reading completed.'))
rs.on('error', err => console.error('An error occurred while reading:', err))