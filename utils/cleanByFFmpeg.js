import { FFmpeg } from "/libs/ffmpeg/ffmpeg/dist/esm/index.js"
import b64 from './base64.js'
import fileDict from './fileDict.js'
import { ChunkSender, ChunkReceiver } from './chunkManager.js'

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
    let key1 = crypto.randomUUID()
    let key2 = crypto.randomUUID()
    await chrome.runtime.sendMessage({type:"offscreenFFmpegRun", key1, key2})
    let cs = new ChunkSender(key1, await fileDict.compose(file))
    let cr = new ChunkReceiver(key2)
    console.log("debug", cs)
    await cs.chunkRuntimeSendMessage()
    let result = await cr.chunkRuntimeReceiveMessage()
    console.log("debug", b64.decode(result))
    
    await chrome.offscreen.closeDocument()
    return b64.decode(result)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(!chrome.offscreen && request.type=="offscreenFFmpegRun"){
        let cr = new ChunkReceiver(request.key1)
        cr.chunkRuntimeReceiveMessage().then(async fd => {
            let file = await fileDict.restore(fd)
            let result = await run(file).then(ret => b64.encode(ret))
            let cs = new ChunkSender(request.key2, result)
            await cs.chunkRuntimeSendMessage()
        })
        sendResponse(true)
        
    }
    return true
})
