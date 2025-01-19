const fs = require('fs').promises
const path = require('path')
const foldername = 'secret-folder'

const dirPath = path.join(__dirname, foldername)

async function readFilesInfo() {
    const files = await fs.readdir(dirPath, { withFileTypes: true })

    for (let file of files) {
        if (file.isFile()) {
            filePath = path.join(dirPath, file.name)
            fileSize = (await fs.stat(filePath)).size
            fileName = file.name
            fileExt = path.extname(fileName)
            console.log(`${fileName} - ${fileExt} - ${fileSize}`)
        }
    }
}

readFilesInfo()

