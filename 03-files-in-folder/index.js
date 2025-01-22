const fs = require('fs').promises
const path = require('path')

const folderName = 'secret-folder'
const folderPath = path.join(__dirname, folderName)

async function readFilesInfo() {
    const files = await fs.readdir(folderPath, { withFileTypes: true })

    for (let file of files) {
        if (file.isFile()) {
            filePath = path.join(folderPath, file.name)
            fileSize = (await fs.stat(filePath)).size
            fileName = path.parse(file.name).name
            fileExt = path.extname(file.name)
            console.log(`${fileName} - ${fileExt.slice(1)} - ${fileSize}`)
        }
    }
}

readFilesInfo()

