import path from "path";
import url from "url";
import fs from "fs/promises";

export type Entry = {
    title: string,
    index: number,
    file: string,
    tags: string[],
}

export type MetadataFile = {
    entries: Record<number, Entry>,
    nextIndex: number,
    new: number[],
    updated: number[],
}

export async function getEntry(index: number) {
    const metadataFile = await getMetadataFile();
    const entries = metadataFile.entries
    const entry = entries[index];
    if(entry) return entry;
    return undefined;
}

export async function readEntry(entry: Entry) {
    const entryFile = entriesDir(entry.file);
    return fs.readFile(entryFile, {encoding: "utf-8"})
}

async function getMetadataFile(): Promise<MetadataFile> {
    const metadataFile = entriesDir("_metadata.json");
    const content = await fs.readFile(metadataFile, { encoding: "utf-8" });
    return JSON.parse(content);
}

function entriesDir(item: string) {
    const __dirname = url.fileURLToPath(new url.URL(".", import.meta.url));
    if (item) {
        return path.join(__dirname, "..", "..", "entries", item);
    }
    return path.join(__dirname, "..", "..", "entries");
}
