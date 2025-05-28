// @ts-check
const { NewEntry, FullEntry } = require('./types.d');
const utils = require('./util');
const fs = require('fs/promises');

module.exports = {
    /**
     * @param {NewEntry} data
    */
    async addEntry(data) {
        const file = `N:${Date.now()}-${data.title.split(" ").join("_").toUpperCase()}.md`;
        const location = utils.entriesDir(file);
        const formattedContent = utils.formatNewContent(data)
        await fs.writeFile(location, formattedContent, { encoding: "utf-8" });

        // processNewFiles();
    },

    /**
     * Reads an entry, based on the entry's index, and includes it's content
     * @param {number} index
     * @returns {Promise<undefined|FullEntry>}
     */
    async readEntryByIndex(index) {
        const {metadata} = await utils.readMetadataFileByEntryIndex(index);
        const entry = metadata.entries[index];
        if(!entry) {
            return undefined;
        }

        const contentLocation = utils.entriesDir(entry.file);
        const exists = await utils.pathExists(contentLocation);
        if( !exists ) {
            return undefined
        }

        const rawContent = await fs.readFile(contentLocation, {encoding: "utf-8"})
        return utils.buildFullEntry(entry, rawContent);
    },

    /**
     * Updates the content of an entry
     * @param {FullEntry} entry - The entry to update
     * @param {string} newContent - The new content of the entry
     */
    async updateEntryContent(entry, newContent) {
        const location = utils.entriesDir(entry.file);
        const c = utils.formatUpdateContent(entry, newContent);
        fs.writeFile(location, c);
    },

    extractPrefix
}

/**
 *
 * @param {string} file
 * @returns
 */
function extractPrefix(file) {
    const indexMatch = file.match(indexedFileRegex);
    if(indexMatch) {
        return {index: parseInt(indexMatch[1])}
    }
    const tempPrefixMatch = file.match(tempPrefixRegex);
    if(tempPrefixMatch) {
        return {tempPrefix: tempPrefixMatch[1]}
    }
    return {index: undefined, tempPrefix: undefined}
}
const indexedFileRegex = /^([0-9]+)(?=-)/;
const tempPrefixRegex = /^(N:[0-9a-zA-Z]+)(?=_)/;

/**
 * @param {number} min
 * @param {number} max
 * @returns
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
