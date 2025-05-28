// @ts-check
const fs = require('node:fs/promises');
const path = require("node:path");
const { randomBytes } = require("node:crypto");
const { execSync } = require("node:child_process");
const { extractPrefix } = require('./entries');
const { simpleGit } = require('simple-git');

const git = simpleGit();
/**
 * Processes new files, gives the file an index, and makes git commits
 * @param {string} entriesDirAbsolutePath
 */
async function processNewFiles(entriesDirAbsolutePath, retryCount = 0) {
    await git.pull()

    const newFiles = []
    const allFilesInDir = await fs.readdir(entriesDirAbsolutePath);
    const {filesToProcess, highestIndex} = sortFilesInEntriesDirectory(allFilesInDir);
    for(let i = 0; i < filesToProcess.length; i++) {
        const newIndex = highestIndex + i + 1;
        const oldFileName = filesToProcess[i].file;
        const newFileName = oldFileName.replace(filesToProcess[i].tempPrefix, newIndex+"");

        const oldPath = path.join(entriesDirAbsolutePath, oldFileName);
        const newPath = path.join(entriesDirAbsolutePath, newFileName);
        newFiles.push(newPath);
        await fs.copyFile(oldPath, newPath);
        await git.add([newPath]);
    }
    await git.commit(`Automated update`);
    const push = await git.push();
    if(push.pushed.length > 0) {
        console.log("Push OK", push)
    }
    else {
        console.log("Push FAILED. Attempt " + retryCount, push)
        processNewFiles(entriesDirAbsolutePath, (retryCount+1))
    }
}

/**
 *
 * @param {string[]} files
 */
function sortFilesInEntriesDirectory(files) {
    const filesToProcess = [];
    let highestIndex = 0;
    for(const file of files) {
        const {index, tempPrefix} = extractPrefix(file);
        if(index && index > highestIndex) {
            highestIndex = index;
        }
        if(tempPrefix) {
            filesToProcess.push({file, tempPrefix});
        }
    }
    return {filesToProcess, highestIndex};
}
