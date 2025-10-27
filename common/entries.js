// @ts-check
const { NewEntry, FullEntry } = require('./types.d');
const { processNewFile } = require('./git');
const utils = require('./util');
const fs = require('fs/promises');

module.exports = {
    /**
     * @param {NewEntry} data
    */
    async addEntry(data) {
        const file = `${Date.now()}-${data.title.replaceAll(/\s/g, "-").toUpperCase()}.md`;
        const entryAbsolutePath = utils.entriesDir(file);
        const formattedContent = utils.formatNewContent(data)
        await fs.writeFile(entryAbsolutePath, formattedContent, { encoding: "utf-8" });
        await processNewFile(entryAbsolutePath, data);
    },

}
