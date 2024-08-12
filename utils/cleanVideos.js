import { FFmpeg } from "/libs/ffmpeg/ffmpeg/dist/esm/index.js"
import b64 from './base64.js'
import fileDict from './fileDict.js'

export default async function(file){
    if(chrome.offscreen){
        return await offscreenRun(file)
    } else {
        return await run(file)
    }
}

async function run(file){
    let ffmpeg = new FFmpeg();
    let data = await file.arrayBuffer()
    await ffmpeg.load({
        coreURL: "/libs/ffmpeg/core/dist/esm/ffmpeg-core.js",
    })
    await ffmpeg.writeFile(file.name, new Uint8Array(data));
    await ffmpeg.exec([
        '-i', file.name,
        '-codec', 'copy',
        '-map_metadata', '-1',
        '-map_chapters', '-1',
        '-disposition', '0',
        '-fflags', '+bitexact',
        '-flags:v', '+bitexact',
        '-flags:a', '+bitexact',
        "cleaned"+file.name
    ]);
    let result = await ffmpeg.readFile("cleaned"+file.name);
    return result.buffer
}

async function offscreenRun(file){
    await chrome.offscreen.createDocument({
        url: '/utils/offscreen.html',
        reasons: ['WORKERS'],
        justification: 'To use ffmpeg.wasm in chromium'
    })
    let result = await chrome.runtime.sendMessage({
        type:"offscreenCleanVideos",
        fileDict: await fileDict.compose(file)
    })
    await chrome.offscreen.closeDocument()
    return b64.decode(result)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(!chrome.offscreen && request.type=="offscreenCleanVideos"){
        let file = fileDict.restore(request.fileDict)
        run(file).then(ret => sendResponse(b64.encode(ret)))
    }
    return true
})
