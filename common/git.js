// @ts-check
const { NewEntry } = require('./types.d');
const { simpleGit, ResetMode } = require('simple-git');
const git = simpleGit();

module.exports = {
    processNewFile,
}

/**
 * Processes new files, and makes git commits
 * @param {string} newEntryAbsolutePath
 * @param {NewEntry} data
 * @param {number} retryCount Should not be set by the user!
 */
async function processNewFile(newEntryAbsolutePath, data, retryCount = 0) {
    console.log("Pulling")
    await git.pull()
    console.log("Pull OK. Adding")
    await git.add(newEntryAbsolutePath);
    console.log("Adding OK. Committing")
    await git.commit(`Add entry: ${data.title}`, ['--no-verify']);
    console.log("Committing OK. Pushing")
    try {
        await git.push();
        console.log("Push OK")
    } catch (error) {
        console.log("Push FAILED. Resetting", error)
        const localBranches = await git.branchLocal();
        console.log("Current branch", localBranches)
        await git.reset(ResetMode.SOFT, [`origin/${localBranches.current}`])
        
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