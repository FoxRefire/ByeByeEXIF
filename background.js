import CleanUp from './utils/cleanup.js';
import sendMessage from './utils/sendMessage.js'

const b64 = {
    decode: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
    encode: b => btoa(Array.from(new Uint8Array(b)).map(e => String.fromCharCode(e)).join(""))
};

function dictToFile(dict){
    return new File([b64.decode(dict.data)], dict.name, {type: dict.type})
}

function createMenu(){
    chrome.contextMenus.create({
        id: "selectFile",
        title: "Cleanup File and upload"
    })
}

function setIndex(){
    return new Promise((resolve, reject) => {
        sendMessage({type:"Index"}).then(res => {
            res ? resolve(res) : reject(res)
        })
    })
}

function queryFile(){
    return new Promise((resolve, reject) => {
        sendMessage({type:"Files"}).then(res => {
            resolve(dictToFile(res))
        })
    })
}

async function go(){
    await setIndex()
    let file = await queryFile()
    let cleanedData = await CleanUp(file)
    sendMessage({type: "Result", fileDict: {
        name: file.name,
        type: file.type,
        data: b64.encode(cleanedData)
    }})
}

chrome.runtime.onInstalled.addListener(createMenu)
chrome.runtime.onStartup.addListener(createMenu)

chrome.contextMenus.onClicked.addListener(go)
chrome.action.onClicked.addListener(go)
