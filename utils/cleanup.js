import sendMessage from './sendMessage.js'
import cleanImages from './cleanImages.js';
import cleanPdf from './cleanPdf.js';
import cleanOffice from './cleanOffice.js';
import cleanVideos from './cleanVideos.js';

export default function(file){
    return new Promise((resolve, reject) => {
        console.log(file)
        let utils = [
            [cleanImages, [".jpg", ".jpeg", ".png", ".gif", ".bmp"]],
            [cleanPdf, [".pdf"]],
            [cleanOffice, [".doc", ".dot", ".docx", ".dotx", ".docm", ".dotm", ".xls", ".xlt", ".xla", ".xlsx", ".xltx", ".xlsm", ".xltm", ".xlam", ".xlsb", ".ppt", ".pot", ".pps", ".ppa", ".pptx", ".potx", ".ppsx", ".ppam", ".pptm", ".potm", ".ppsm", ".mdb", ".odt", ".ods", ".odp", ".odg", ".odc", ".odf", ".odi", ".odm", ".odb", ".ott", ".ots", ".otp", ".otg", ".otc", ".oti", ".oth"]],
            [cleanVideos, [".mp4"]]
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
