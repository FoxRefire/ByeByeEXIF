import CleanUp from './utils/cleanup.js';
import fileDict from './utils/fileDict.js'
import { ChunkSender, ChunkReceiver } from './utils/chunkManager.js'

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

async function queryFiles(id){
    let key = crypto.randomUUID()
    let cr = new ChunkReceiver(key)
    let res = cr.chunkRuntimeReceiveMessage()
    await chrome.tabs.sendMessage(id, {type:"QueryFiles", key})
    return Object.values(fileDict.multiRestore(await res))
}

async function sendResult(id, fileDicts){
    let key = crypto.randomUUID()
    await chrome.tabs.sendMessage(id, {type: "Result", key})
    let cs = new ChunkSender(key, fileDicts)
    await cs.chunkTabSendMessage(id)
}

async function go(id){
    await setIndex(id)
    let fileDicts = []
    for(let file of await queryFiles(id)){
        let cleanedData = await CleanUp(id, file)
        fileDicts.push(await fileDict.compose(file, cleanedData))
    }

    sendResult(id, fileDicts)
}

if(chrome.contextMenus){
    chrome.runtime.onInstalled.addListener(createMenu)
    chrome.runtime.onStartup.addListener(createMenu)

    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
        switch(info.menuItemId){
            case "browse":
                go(tab.id)
                break
            case "dragUpload":
                await setIndex(tab.id)
                chrome.windows.create({
                    url: "dragUpload.html?id=" + tab.id,
                    type: "popup",
                    width: 710,
                    height: 570
                });
                break
        }
    })
}
chrome.action.onClicked.addListener(tab => go(tab.id))
