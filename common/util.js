// @ts-check
const fs = require("fs/promises");
const path = require("path");
const { NewEntry, MetadataEntry, FullEntry } = require('./types.d')

module.exports = {
    entriesDir,
    pathExists,
    formatNewContent,
    formatUpdateContent,
    buildFullEntry,
}

/**
 * Calculate the absolute path to the entries directory,
 * or to an item within the entries directory. This function
 * does not validate that the item in question exists or not,
 * it merely calculates the path.
 * @param {string[]} item
 * @returns {string}
*/
function entriesDir(...item) {
    if (item.length > 0) {
        return path.join(__dirname, "..", "entries", ...item);
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

/**
 * @param {NewEntry} entry
 * @returns
 */
function formatNewContent(entry) {
    return `---
title: ${entry.title}
created: ${Date.now()}
updated:
tags: ${entry.tags.join(",")}
slug: ${encodeURIComponent(entry.title)}
---
${entry.content}
`;
}

/**
 * @param {FullEntry} entry
 * @param {string} content
 * @returns
 */
function formatUpdateContent(entry, content) {
    return `---
title: ${entry.title}
created: ${entry.created}
updated: ${Date.now()}
tags: ${entry.tags.join(",")}
slug: ${encodeURIComponent(entry.title)}
---
${content}
`;
}

/**
 * @param {MetadataEntry} entry
 * @param {string} rawContent
 */
function buildFullEntry(entry, rawContent) {
    const matches = rawContent.match(/---(?<props>[\S\s]+?)---(?<content>[\S\s]*)/);
    if(!matches || !matches.groups || !matches.groups.content) {
        throw new Error(`Error when extracting entry content. Please verify the content block of entry with index ${entry.index}`);
    }
    const content = matches.groups.content.trim();

    if(!matches || !matches.groups || !matches.groups.props) {
        throw new Error(`Error when extracting entry properties. Please verify the metadata block of entry with index ${entry.index}`);
    }
    const properties = matches.groups.props;
    console.log(properties)

    const created = extractNumberProperty(properties, 'created')
    const updated = extractNumberProperty(properties, 'updated')
    const title = extractStringProperty(properties, 'title') ?? '';
    const tags = extractStringProperty(properties, 'tags')?.split(",") ?? [];
    const slug = extractStringProperty(properties, 'slug') ?? '';
    return {...entry, title, tags, created, updated, content, slug}
}

/**
 * @param {string} s
 * @param {string} name
 */
function extractStringProperty(s, name) {
    const regex = new RegExp(`^${name}: ?(?<m>.+)$`, 'm')
    const match = s.match(regex);
    return match?.groups?.m ?? undefined
}

/**
 * @param {string} s
 * @param {string} name
 */
function extractNumberProperty(s, name) {
    const regex = new RegExp(`^${name}: ?(?<m>[0-9]+)$`, 'm')
    const match = s.match(regex);
    const str = match?.groups?.m ?? ''
    return Number.parseInt(str) || undefined
}
