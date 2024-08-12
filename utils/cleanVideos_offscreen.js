import { FFmpeg } from "/libs/ffmpeg/ffmpeg/dist/esm/index.js"
console.log("test")

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type=="offscreenCleanVideos"){
        console.log(request)
        sendResponse("")
    }
})
