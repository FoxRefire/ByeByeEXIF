import { FFmpeg } from "/libs/ffmpeg/ffmpeg/dist/esm/index.js"

export default async function(file){
    let ffmpeg = new FFmpeg();
    await ffmpeg.load({
        coreURL: "/ffmpeg/core/dist/esm/ffmpeg-core.js",
    })
    await ffmpeg.writeFile(file.name, await file.arrayBuffer());
    await ffmpeg.exec([
        '-i', file.name,
        '-y',
        '-codec', 'copy',
        '-map_metadata', '-1',
        '-map_chapters', '-1',
        '-disposition', '0',
        '-fflags', '+bitexact',
        '-flags:v', '+bitexact',
        '-flags:a', '+bitexact',
        file.name
    ]);
    result = await ffmpeg.readFile(file.name);
    return result.buffer
}
