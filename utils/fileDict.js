import b64 from './base64.js'
export default {
    async compose(file, data){
        let _data = data || await file.arrayBuffer()
        return {
            name: file.name,
            type: file.type,
            data: b64.encode(_data)
        }
    },
    restore(dict){
        return new File([b64.decode(dict.data)], dict.name, {type: dict.type})
    },
    async multiCompose(files){
        let fileDicts = []
        for(let file of Object.values(files)){
            fileDicts.push(await this.compose(file))
        }
        return fileDicts
    },
    multiRestore(dicts){
        let dataTransfer = new DataTransfer();
        dicts.forEach(dict => {
            let file = this.restore(dict)
            dataTransfer.items.add(file);
        })
        return dataTransfer.files
    }
}
