import fileDict from './utils/fileDict.js'
import { ChunkSender, ChunkReceiver } from './utils/chunkManager.js'

function setIndex(nl){
    if(nl.length == 1){
        window.fileIndex = 0
        return true
    } else if(nl.length == 0){
        alert("File Selector element wasn't detected")
    } else {
        let input = prompt(`Multiple elements were detected.\nPlease enter a index number from 0 to ${nl.length - 1}`, 0)
        if(input == undefined || input == null){
            alert("Index assignment has been canceled")
        } else if(!(0 <= Number(input) && Number(input) < nl.length)) {
            alert("Index assignment is incorect")
        } else {
            window.fileIndex = Number(input)
            return true
        }
    }
    return false
}

function getElements(){
    if(!window.fileSelectors){
        window.fileSelectors = document.querySelectorAll('input[type="file"]')
    }
    return window.fileSelectors
}

async function openFileChooser(){
    await unlockUserActivation()
    let input = document.createElement('input');
    input.type = "file"
    input.multiple = getElements()[window.fileIndex].multiple
    input.click()
    return new Promise(resolve => {
        input.addEventListener("change", async () => {
            resolve(await fileDict.multiCompose(input.files))
        })
    })
}

function unlockUserActivation(){
    return new Promise(resolve => {
        if(navigator.userActivation.isActive){
            resolve()
        } else {
            alert("To unlock user activation, click anywhere in webpage")
            setInterval(() => {
                navigator.userActivation.isActive ? resolve() : null
            }, 100)
        }
    })
}

function uploadResult(fd, index){
    if(getElements()[window.fileIndex].multiple) {
        getElements()[index].files = fileDict.filesToFileList(fileDict.multiRestore(fd))
    } else {
        getElements()[index].files = fileDict.filesToFileList(fileDict.multiRestore([fd[0]]))
    }
    getElements()[index].dispatchEvent(new Event("change", {bubbles: true, composed: true}))
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type){
        case "Index":
            let bool = setIndex(getElements())
            sendResponse(bool)
            break;
        case "QueryFiles":
            openFileChooser().then(files => {
                let cs = new ChunkSender(request.key, files)
                console.log(cs)
                cs.chunkRuntimeSendMessage()
                sendResponse(true)
            })
            break;
        case "Result":
            let cr = new ChunkReceiver(request.key)
            console.log(cr)
            cr.chunkRuntimeReceiveMessage().then(fileDict => {
                uploadResult(fileDict, window.fileIndex)
            })
            sendResponse(true)
            break;
        case "Error":
            alert("Unsuppoted file format")
            sendResponse(true)
    }
    return true
})
