/**
 * @typedef Entry
 * @type {object}
 * @property {string} title - Title of the entry
 * @property {number} index - Index of the entry
 * @property {string} file - File name of the entry
 * @property {number} created - Unix timestamp for when entry was created

 * @property {string[]} tags - Tags for the entry
 */
/**
 * @type Entry
 */
let Entry;

/**
 * @typedef NewEntry
 * @type {object}
 * @property {string} title - Title of the entry
 * @property {string} body - Content of the entry
 * @property {string[]} tags - Tags for the entry
 */
/**
 * @type NewEntry
 */
let NewEntry;

/**
 * @typedef MetadataFile
 * @type {object}
 * @property {Record<number,Entry>} entries - Map of index -> entry
 * @property {number} nextIndex - Next index to assign a new entry

 */
/**
 * @type MetadataFile
 */
let MetadataFile;

module.exports = {
    Entry,
    NewEntry,
    MetadataFile,
}
