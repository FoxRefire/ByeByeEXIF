import sendMessage from './sendMessage.js'
import cleanImages from './cleanImages.js';
export default function(file){
    return new Promise((resolve, reject) => {
        console.log(file)
        let utils = [
            [cleanImages, ["image/jpeg","image/png","image/gif","image/bmp"]]
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
