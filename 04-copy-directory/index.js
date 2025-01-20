const fs = require('fs').promises
const path = require('path')

const newFolder = 'files-copy'
const oldFolder = 'files'
const oldPath = path.resolve(__dirname, oldFolder)
const newPath = path.resolve(__dirname, newFolder)

async function copyDir(oldPath, newPath) {
    try {
        await fs.access(newPath)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            await fs.mkdir(newPath, { recursive: true })
        }
    }
    const toCopyItems = await fs.readdir(oldPath, { withFileTypes: true })
    for (let item of toCopyItems) {
        const oldItemPath = path.join(oldPath, item.name)
        const newItemPath = path.join(newPath, item.name)
        if (item.isDirectory()) {
            await copyDir(oldItemPath, newItemPath)
        }
        else {
            const oldStat = await fs.stat(oldItemPath);
            const newStat = await fs.stat(newItemPath).catch(() => null);

            if (!newStat || oldStat.mtime > newStat.mtime) {
                await fs.copyFile(oldItemPath, newItemPath)
            }
        }
    }

    const copiedItems = await fs.readdir(newPath, { withFileTypes: true })
    for (let item of copiedItems) {
        const oldItemPath = path.join(oldPath, item.name)
        const newItemPath = path.join(newPath, item.name)
        try {
            await fs.access(oldItemPath)
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                if (item.isDirectory()) await fs.rm(newItemPath, { recursive: true })
                else await fs.unlink(newItemPath)
            }
        }
    }
}
copyDir(oldPath, newPath)