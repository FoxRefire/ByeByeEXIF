import b64 from './base64.js'
export default {
    compose: async (file, data) => {
        let _data
        data ? _data = data : _data = await file.arrayBuffer()
        return {
            name: file.name,
            type: file.type,
            data: b64.encode(_data)
        }
    },
    restore: dict => new File([b64.decode(dict.data)], dict.name, {type: dict.type})
}
