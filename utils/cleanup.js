import sendMessage from './sendMessage.js'
import cleanImages from './cleanImages.js';
import cleanPdf from './cleanPdf.js';
import cleanOffice from './cleanOffice.js';
import cleanByFFmpeg from './cleanByFFmpeg.js';

export default function(file){
    return new Promise((resolve, reject) => {
        console.log(file)
        let utils = [
            [cleanImages, [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]],
            [cleanPdf, [".pdf"]],
            [cleanOffice, [".doc", ".dot", ".docx", ".dotx", ".docm", ".dotm", ".xls", ".xlt", ".xla", ".xlsx", ".xltx", ".xlsm", ".xltm", ".xlam", ".xlsb", ".ppt", ".pot", ".pps", ".ppa", ".pptx", ".potx", ".ppsx", ".ppam", ".pptm", ".potm", ".ppsm", ".mdb", ".odt", ".ods", ".odp", ".odg", ".odc", ".odf", ".odi", ".odm", ".odb", ".ott", ".ots", ".otp", ".otg", ".otc", ".oti", ".oth"]],
            [cleanByFFmpeg, [".mp4", ".webm", ".ogv", ".mpg", ".mpeg", ".m1v", ".m4v", ".avi", ".mkv", ".mov", ".wmv", ".avif", ".avifs"]], //Videos
            [cleanByFFmpeg, [".mp3", ".aac", ".wav", ".wv", ".ogg", ".opus", ".flac"]], //Audios
            [cleanByFFmpeg,[".heic", ".ppm", ".tiff"]] //Minor images
        ]

        for(let util of utils){
            if(util[1].some(e => file.name.endsWith(e))){
                util[0](file).then(result => resolve(result))
                return
            }
        }

        sendMessage({type: "Error"})
        reject()
    })
}
