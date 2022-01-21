import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import fetch from '../lib/node-fetch.js';

export const createTargetDirectoryAndDownloadFile = async (url, filename, targetDirectory) => {
    await mkdir(targetDirectory, { recursive: true, })
        .catch(e=>Promise.reject(`Failed to create targetDirectory directory ${targetDirectory}: ${e}`));
    
    const body = await fetch(url)
      .then((x) => x.buffer())
      .catch((err) => Promise.reject(`Failed to download: ${url} => ${err}`));
    
    console.log(`Download completed: ${url}`);
    const pathLike = path.join(targetDirectory, filename)
    await writeFile(pathLike, body);
    console.log(`File saved: ${pathLike}`);
    return pathLike;
};