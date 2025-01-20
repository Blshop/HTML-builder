const fs = require('fs').promises
const path = require('path')
const newFolder = 'files-copy'
const oldFolder = 'files'
const oldPath = path.resolve(__dirname, oldFolder)
const newPath = path.resolve(__dirname, newFolder)

async function copyDir() {
    try {
        await fs.access(newPath)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            await fs.mkdir(newPath, { recursive: true })
        }
    }
    const toCopyFiles = await fs.readdir(oldPath)
    for (let file of toCopyFiles) {
        const oldFilePath = path.join(oldPath, file)
        const newFilePath = path.join(newPath, file)


        const oldStat = await fs.stat(oldFilePath);
        const newStat = await fs.stat(newFilePath).catch(() => null);

        if (!newStat || oldStat.mtime > newStat.mtime) {
            await fs.copyFile(oldFilePath, newFilePath)
        }
    }

    const copiedFiles = await fs.readdir(newPath)
    for (let file of copiedFiles) {
        const oldFilePath = path.join(oldPath, file)
        const newFilePath = path.join(newPath, file)

        const oldStat = await fs.stat(oldFilePath).catch(() => null);
        if (!oldStat) {
            await fs.unlink(newFilePath)
        }
    }
}
copyDir()