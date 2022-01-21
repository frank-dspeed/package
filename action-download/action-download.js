import core from '../lib/actions-core.js'
import {
    createTargetDirectoryAndDownloadFile
} from '../modules/download.js';

function getFilenameFromUrl(url) {
    const { pathname } = new URL(url);
    const pathClips = pathname.split("/");
    const filenameWithArgs = pathClips[pathClips.length - 1];
    return filenameWithArgs.replace(/\?.*/, "");
}

const getSettings = () => {
    const text = core.getInput("url");
    const targetDirectory = core.getInput("target");
    const filename = core.getInput("filename");
    const autoMatch = !(["false", "0"].includes(core.getInput("auto-match").toLowerCase().trim()));
    const match = text.match(/\((.*)\)/);
    const url = ((!autoMatch) ? text : `${ (!match) ? "" : (match[1] || "") }`).trim();
    
    if (!url) { 
        throw new Error(`Failed to find a URL. Using Automatch: ${autoMatch}`); 
    };
    
    const finalFilename = filename ? `${filename}` : getFilenameFromUrl(url);

    if (finalFilename === "") { 
        throw new Error("Filename not found. Please indicate it in the URL or set `filename` in the workflow.");
    }
    
    return { url, filename: finalFilename, targetDirectory}
}

const objToOutput = (obj) => Object.keys(obj).forEach(key=>core.setOutput(key, obj[key]));

async function main() {
  const { url, filename, targetDirectory } = getSettings();
  console.log(`URL found: ${url}`);
  const pathLike = await createTargetDirectoryAndDownloadFile(url,filename,targetDirectory);
  objToOutput({ filename, path: pathLike })
}

main().catch( (error) => core.setFailed(error.message) );