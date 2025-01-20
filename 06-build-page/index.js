const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')

const cssFileName = 'style.css'
const projectFolder = 'project-dist'
const stylesFolder = 'styles'
const templateName = 'template.html'
const indexHTML = 'index.html'
const componentsFolder = 'components'
const componentsPath = path.resolve(__dirname, componentsFolder)
const templatePath = path.resolve(__dirname, templateName)
const projectPath = path.resolve(__dirname, projectFolder)
const cssStylePath = path.resolve(projectPath, cssFileName)
const indexPath = path.resolve(projectPath, indexHTML)
const stylesPath = path.resolve(__dirname, stylesFolder)
const assetsFolder = 'assets'
const oldAssetsPath = path.resolve(__dirname, assetsFolder)
const newAssetsPath = path.resolve(projectPath, assetsFolder)


async function compileCSS() {
    const ws = fs.createWriteStream(cssStylePath, 'utf8')
    const toCopystyles = await fsPromises.readdir(stylesPath)
    for (let file of toCopystyles) {
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

async function copyDir(oldPath, newPath) {
    try {
        await fsPromises.access(newPath)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            await fsPromises.mkdir(newPath, { recursive: true })
        }
    }
    const toCopyItems = await fsPromises.readdir(oldPath, { withFileTypes: true })
    for (let item of toCopyItems) {
        const oldItemPath = path.join(oldPath, item.name)
        const newItemPath = path.join(newPath, item.name)
        if (item.isDirectory()) {
            await copyDir(oldItemPath, newItemPath)
        }
        else {
            const oldStat = await fsPromises.stat(oldItemPath);
            const newStat = await fsPromises.stat(newItemPath).catch(() => null);

            if (!newStat || oldStat.mtime > newStat.mtime) {
                await fsPromises.copyFile(oldItemPath, newItemPath)
            }
        }
    }

    const copiedItems = await fsPromises.readdir(newPath, { withFileTypes: true })
    for (let item of copiedItems) {
        const oldItemPath = path.join(oldPath, item.name)
        const newItemPath = path.join(newPath, item.name)
        try {
            await fsPromises.access(oldItemPath)
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                if (item.isDirectory()) await fsPromises.rm(newItemPath, { recursive: true })
                else await fsPromises.unlink(newItemPath)
            }
        }
    }
}

async function replaceTemplate() {
    let templateFile = await fsPromises.readFile(templatePath, 'utf8')
    const components = await fsPromises.readdir(componentsPath);
    for (let component of components) {
        if (path.extname(component) === '.html') {
            const componentPath = path.join(componentsPath, component)
            const content = await fsPromises.readFile(componentPath, 'utf-8')
            const tag = `{{${path.parse(component).name}}}`;
            templateFile = templateFile.replace(new RegExp(tag, 'g'), content);
        }

    }
    await fsPromises.writeFile(indexPath, templateFile, 'utf8');

}
async function build() {
    try {
        await fsPromises.access(projectPath)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            await fsPromises.mkdir(projectPath, { recursive: true })
        }
    }
    replaceTemplate()
    copyDir(oldAssetsPath, newAssetsPath)
    compileCSS()
}
build()



