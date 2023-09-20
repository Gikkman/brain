// @ts-check
const fs = require("fs/promises");
const path = require("path");
const { NewEntry, Entry, MetadataFile } = require('../types/types.d')

module.exports = {
    /**
     * @param {NewEntry} data
    */
    async addEntry(data) {
        const metadata = await readMetadataFile();

        const index = metadata.nextIndex;
        const file = `${index}-${data.title.toUpperCase()}.md`
        const location = entriesDir(file)
        fs.writeFile(location, data.body, { encoding: "utf-8" });

        const now = Date.now();
        const entryToAdd = {
            title: data.title,
            file: file,
            tags: data.tags,
            created: now,
            updated: now,
            index,
        }

        metadata.nextIndex = index + 1;
        metadata.entries[index] = entryToAdd;

        metadata.new.push(index);
        while(metadata.new.length > 5) {
            metadata.new.shift()
        }

        metadata.updated.push(index);
        while(metadata.updated.length > 5) {
            metadata.updated.shift()
        }

        return writeMetadataFile(metadata)
    },

    /**
     * Reads an entry, based on the entry's index, and includes it's content
     * @param {number} index
     * @returns {Promise<undefined|Entry&{content:string}>}
     */
    async readEntryByIndex(index) {
        const metadataFile = await readMetadataFile();
        const entry = metadataFile.entries[index];
        if(!entry) {
            return undefined;
        }

        const contentLocation = entriesDir(entry.file);
        const exists = await pathExists(contentLocation);
        if( !exists ) {
            return undefined
        }

        const content = await fs.readFile(contentLocation, {encoding: "utf-8"})
        return {...entry, content};
    },

    /**
     * Updates the content of an entry
     * @param {Entry} entry - The entry to update
     * @param {string} newContent - The new content of the entry
     */
    async updateEntryContent(entry, newContent) {
        const location = entriesDir(entry.file);
        fs.writeFile(location, newContent);
        const metadata = await readMetadataFile();

        if(metadata.updated.includes(entry.index)) {
            // Move the entry last in the array, indicated it was edited last
            const filtered = metadata.updated.filter(e => e !== entry.index)
            filtered.push(entry.index);
            metadata.updated = filtered;
        }
        else {
            // Add the entry to the updated list, and remove the oldest
            metadata.updated.push(entry.index);
            while(metadata.updated.length > 5) {
                metadata.updated.shift()
            }
        }

        metadata.entries[entry.index].updated = Date.now();
        writeMetadataFile(metadata);
    },
}

/**
     * @returns {Promise<MetadataFile>}
    */
async function readMetadataFile() {
    const metadataFile = entriesDir("_metadata.json");
    const content = await fs.readFile(metadataFile, { encoding: "utf-8" });
    return JSON.parse(content);
}

/**
 * Write the metdata file to disk
 * @param {MetadataFile} file
 */
async function writeMetadataFile(file) {
    const metadataFile = entriesDir("_metadata.json");
    return fs.writeFile(metadataFile, JSON.stringify(file), {encoding: "utf-8"});
}

/**
 * Calculate the absolute path to the entries directory,
 * or to an item within the entries directory. This function
 * does not validate that the item in question exists or not,
 * it merely calculates the path.
 * @param {string?} item
 * @returns {string}
*/
function entriesDir(item) {
    if (item) {
        return path.join(__dirname, "..", "entries", item);
    }
    return path.join(__dirname, "..", "entries");
}

/**
 * Checks whether something exists at a path. May take an absolute path, or
 * a path relative to the current working directory.
 * @param {string} path - Path to check
 * @returns {Promise<boolean>}
 */
async function pathExists(path) {
    try {
        await fs.stat(path);
        return true;
    } catch(e) {
        return false;
    }
}
