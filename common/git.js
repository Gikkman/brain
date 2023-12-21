// @ts-check
const fs = require('fs/promises');
const { execSync } = require("child_process");

class Git {
    forcePull() {
        execSync("git pull --force")
    }

    /**
     * Adds one or more files to the current commit
     * @param {string[]} files
     */
    addFiles(files) {
        execSync(`git add ${files.join(" ")}`)
    }

    /**
     * Commit the added files to the index
     * @param {string} message
     */
    commit(message) {
        execSync(`git commit -m "${message}"`)
    }

    push() {
        execSync(`git push`);
    }
}

function processNewFiles() {
    // Find entries that start with NNN
    // Figure out next index
}
