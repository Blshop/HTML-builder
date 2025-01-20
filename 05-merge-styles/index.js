const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const resultFileName = 'bundle.css'
const projectFolder = 'project-dist'
const stylesFolder = 'styles'
const resultFilePath = path.join(__dirname, projectFolder, resultFileName)
const stylesPath = path.resolve(__dirname, stylesFolder)

async function copyDir() {
    const ws = fs.createWriteStream(resultFilePath, 'utf8')
    const toCopyFiles = await fsPromises.readdir(stylesPath)
    for (let file of toCopyFiles) {
        if (path.extname(file) === '.css') {
            const styleFilePath = path.join(stylesPath, file)
            const rs = fs.createReadStream(styleFilePath, 'utf8')
            rs.on('data', data => ws.write(data))
            rs.on('end', () => {
                ws.end()
                rs.close()
            })
            rs.on('error', err => console.error('An error occurred while reading:', err))
        }
    }
}
copyDir()