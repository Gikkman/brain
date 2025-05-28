/**
 * @typedef MetadataEntry
 * The data about an entry that exists in the Metadata file
 * @type {object}
 * @property {number} index - Index of the entry
 * @property {string} title - Title of the entry
 * @property {string} file - File name of the entry
 * @property {string[]} tags - Tags for the entry
 */
/**
 * @type MetadataEntry
 */
let MetadataEntry;

/**
 * @typedef NewEntry
 * The user required input for creating a new entry
 * @type {object}
 * @property {string} title - Title of the entry
 * @property {string} content - Content of the entry
 * @property {string[]} tags - Tags for the entry
*/
/**
 * @type NewEntry
*/
let NewEntry;

/**
 * @typedef FullEntry
 * All information about an properly stored entry
 * @type {object}
 * @property {number} index - Index of the entry
 * @property {string} title - Title of the entry
 * @property {string} content - Content of the entry
 * @property {number} [created] - When the entry was first created
 * @property {number} [updated] - When the entry was last updated
 * @property {string} file - File name of the entry
 * @property {string[]} tags - Tags for the entry
 * @property {string} slug - The URL slug for the entry
 */
/**
 * @type FullEntry
 */
let FullEntry;

/**
 * @typedef MetadataFile
 * @type {object}
 * @property {Record<number,MetadataEntry>} entries - Map of index -> entry
 */
/**
 * @type MetadataFile
 */
let MetadataFile;

module.exports = {
    MetadataEntry,
    NewEntry,
    FullEntry,
    MetadataFile,
}
