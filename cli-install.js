"use strict";
import * as fs from 'fs';
import * as os from 'os';
import * as url from 'url';
import * as path from 'path';

console.log("Running cli-install script")

// Figure out where this file resides
const brainDir = path.dirname(url.fileURLToPath(import.meta.url));
const brainCliDir = path.join(brainDir, "cli");

const entriesDir = path.join(brainDir, "entries");
createFolderIfNotExist(entriesDir);

const entriesMetadataDir = path.join(entriesDir, "metadata");
createFolderIfNotExist(entriesMetadataDir)

const metadataFile = path.join(entriesMetadataDir, "0_metadata.json");
createFileIfNotExist(metadataFile, {entries: {}, nextIndex: 1})

const tagMapFile = path.join(entriesMetadataDir, "tag-map.json");
createFileIfNotExist(tagMapFile, {})

const rcFiles = fs.readdirSync( os.homedir() )
    .filter(e => [".zshrc", ".bashrc", ".bash_profile"].includes(e))
    .map(e => {
        const location = path.join(os.homedir(), e);
        return {
            file: e,
            location,
            content: fs.readFileSync(location, {"encoding": "utf8"})
        }
    })
    // Filter away rc files that sources other rc files
    .filter(e => !e.content.includes(".bashrc"))
    .filter(e => !e.content.includes(".zshrc"))
    .filter(e => !e.content.includes(".bash_profile"))
    // Filter away rc files that already includes a BrainJS section
    .filter(e => !e.content.includes("### MANAGED BY BrainJS"));

const sourcing = `
### MANAGED BY BrainJS (Start)
export PATH="${brainCliDir}/bin:$PATH"
### MANAGED BY BrainJS (End)
`;
for(const rcFile of rcFiles) {
    console.log("Adding sourcing information to rcFile: " + rcFile.file)
    fs.appendFileSync(rcFile.location, sourcing, "utf8");
}

// TODO: Prompt for which editor to use

console.log("Finished cli-install script")

///////////////////////////////////////////////////////////////////////////////////////////////
//                              Function
///////////////////////////////////////////////////////////////////////////////////////////////
function createFolderIfNotExist(path){
    if(fs.existsSync(path)) {
        console.log(`Folder '${path}' already existed. Skipping creation.`)
    }
    else {
        console.log("Creating folder at " + entriesDir)
        fs.mkdirSync(entriesDir);
    }
}

function createFileIfNotExist(path, content){
    if(fs.existsSync(path)) {
        console.log(`File '${path}' already existed. Skipping creation.`)
    }
    else {
        console.log("Creating file at " + path)
        fs.writeFileSync(metadataFile, JSON.stringify(content, null, 2), {encoding: "utf8"});
    }
}
