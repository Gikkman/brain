// @ts-check
const fs = require("fs/promises");
const path = require("path");
const { NewEntry, Entry, MetadataFile } = require('../types/types.d')

module.exports = {
    /**
     * @param {NewEntry} data
    */
    async addEntry(data) {
        const {partition, metadata} = await readLastMetadataFile();

        const index = metadata.nextIndex;
        const file = `${index}-${data.title.split(" ").join("_").toUpperCase()}.md`
        const location = entriesDir(file)
        fs.writeFile(location, data.body, { encoding: "utf-8" });

        const entryToAdd = {
            title: data.title,
            file: file,
            tags: data.tags,
            created: Date.now(),
            index,
        }

        metadata.nextIndex = index + 1;
        metadata.entries[index] = entryToAdd;

        return writeMetadataFile(partition, metadata)
    },

    /**
     * Reads an entry, based on the entry's index, and includes it's content
     * @param {number} index
     * @returns {Promise<undefined|Entry&{content:string}>}
     */
    async readEntryByIndex(index) {
        const {metadata} = await readMetadataFileByEntryIndex(index);
        const entry = metadata.entries[index];
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
    },
}

/**
 * Read the metadata file that has metadata for the given entry index
 * @param {number} entryIndex
 */
async function readMetadataFileByEntryIndex(entryIndex) {
    const partitionIndex = Math.floor(entryIndex / 100);
    return readMetadataFileByPartition(partitionIndex)
}

/**
 * Read the most recent metadata file
 */
async function readLastMetadataFile() {
    const files = await fs.readdir(entriesDir());
    const metadataFiles = files.filter(f => f.endsWith("metadata.json"))
    const partitionIndex = metadataFiles.length > 0 ? metadataFiles.length-1 : 0;
    return readMetadataFileByPartition(partitionIndex)
}

/**
 * Read the metadata file that represents the parameter partition
 * @param {number} partition
 * @returns {Promise<{partition: number, metadata: MetadataFile}>}
 */
async function readMetadataFileByPartition(partition) {
    const metadataFile = entriesDir(`${partition}_metadata.json`);
    const content = await fs.readFile(metadataFile, { encoding: "utf-8" });
    const metadata = JSON.parse(content);
    return {partition, metadata}
}

/**
 * Write the metadata file to disk
 * @param {number} partition The metadata partition to write to
 * @param {MetadataFile} metadata What to write to the metadata file
 */
async function writeMetadataFile(partition, metadata) {
    const metadataFile = entriesDir(`_${partition}-metadata.json`);
    return fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2), {encoding: "utf-8"});
}

/**
 * Calculate the absolute path to the entries directory,
 * or to an item within the entries directory. This function
 * does not validate that the item in question exists or not,
 * it merely calculates the path.
 * @param {string} [item]
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
