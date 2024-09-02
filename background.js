import CleanUp from './utils/cleanup.js';
import fileDict from './utils/fileDict.js'

function createMenu(){
    chrome.contextMenus.create({
        id: "selectFile",
        title: "Cleanup File and upload"
    })
}

async function setIndex(id){
    let res = await chrome.tabs.sendMessage(id, {type:"Index"})
    if(res) return res
    throw res
}

async function queryFile(id){
    let res = await chrome.tabs.sendMessage(id, {type:"Files"})
    return fileDict.restore(res)
}

async function go(id){
    await setIndex(id)
    let file = await queryFile(id)
    let cleanedData = await CleanUp(id, file)

    chrome.tabs.sendMessage(id, {
        type: "Result",
        fileDict: await fileDict.compose(file, cleanedData)
    })
}

if(chrome.contextMenus){
    chrome.runtime.onInstalled.addListener(createMenu)
    chrome.runtime.onStartup.addListener(createMenu)

    chrome.contextMenus.onClicked.addListener((_, tab) => go(tab.id))
}
chrome.action.onClicked.addListener(tab => go(tab.id))
