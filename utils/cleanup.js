import sendMessage from './sendMessage.js'
import cleanImages from './cleanImages.js';
import cleanPdf from './cleanPdf.js';

export default function(file){
    return new Promise((resolve, reject) => {
        console.log(file)
        let utils = [
            [cleanImages, ["image/jpeg","image/png","image/gif","image/bmp"]],
            [cleanPdf, ["application/pdf"]]
        ]

        for(let util of utils){
            if(util[1].includes(file.type)){
                util[0](file).then(result => resolve(result))
                return
            }
        }

        sendMessage({type: "Error"})
        reject()
    })
}
