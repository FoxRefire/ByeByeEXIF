import CleanUp from './utils/cleanup.js';
import fileDict from './utils/fileDict.js'

function createMenu(){
    chrome.contextMenus.create({
        id: "parent",
        title: "Cleanup File and upload"
    })
    chrome.contextMenus.create({
        id: "browse",
        parentId: "parent",
        title: "Browse"
    })
    chrome.contextMenus.create({
        id: "dragUpload",
        parentId: "parent",
        title: "Upload by drag and drop"
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

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        switch(info.menuItemId){
            case "browse":
                go(tab.id)
                break
            case "dragUpload":
                chrome.windows.create({
                    url: "dragUpload.html?id=" + tab.id,
                    type: "popup",
                    width: 710,
                    height: 570
                });
        }
    })
}
chrome.action.onClicked.addListener(tab => go(tab.id))
