// @ts-check
const { NewEntry } = require('./types.d');
const utils = require('./util');
const fs = require('fs');

module.exports = {
    addEntry,
}

/**
 * @param {NewEntry} data
*/
function addEntry(data) {
    const file = `${Date.now()}-${data.title.replaceAll(/\s/g, "-").toUpperCase()}.md`;
    const entryAbsolutePath = utils.entriesDir(file);
    const formattedContent = utils.formatNewContent(data)
    fs.writeFileSync(entryAbsolutePath, formattedContent, { encoding: "utf-8" });
    return entryAbsolutePath;
}
