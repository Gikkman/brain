import { NewEntry } from './types.d';

// @ts-check
const fs = require('node:fs/promises');
const { simpleGit } = require('simple-git');
const git = simpleGit();

/**
 * Processes new files, and makes git commits
 * @param {string} newEntryAbsolutePath
 * @param {NewEntry} data
 * @param {number} retryCount Should not be set by the user!
 */
export async function processNewFile(newEntryAbsolutePath, data, retryCount = 0) {
    await git.pull()
    await git.add(newEntryAbsolutePath);
    await git.commit(`Add entry: ${data.title}`);
    const push = await git.push();
    if(push.pushed.length > 0) {
        console.log("Push OK", push)
    }
    else {
        console.log("Push FAILED. Resetting to origin", push)
        const currentBranch = await git.branch(['--show-current']);
        await git.reset(['--soft', `origin/${currentBranch}`])
        
        if (retryCount < 5) {
            console.log("Retrying...")
            return processNewFile(newEntryAbsolutePath, data, (retryCount+1))
        }
       else {
           console.error("Max retries reached")
           // TODO: Handle this better
       }
    }
}