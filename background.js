import CleanUp from './utils/cleanup.js';
import sendMessage from './utils/sendMessage.js'
import fileDict from './utils/fileDict.js'

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
            resolve(fileDict.restore(res))
        })
    })
}

async function go(){
    await setIndex()
    let file = await queryFile()
    let cleanedData = await CleanUp(file)
    sendMessage({type: "Result", fileDict: await fileDict.compose(file, cleanedData)})
}

if(chrome.contextMenus){
    chrome.runtime.onInstalled.addListener(createMenu)
    chrome.runtime.onStartup.addListener(createMenu)

    chrome.contextMenus.onClicked.addListener(go)
}
chrome.action.onClicked.addListener(go)
