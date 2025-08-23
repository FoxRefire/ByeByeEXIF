import CleanUp from './utils/cleanup.js';
import fileDict from './utils/fileDict.js'
import { ChunkSender } from './utils/chunkManager.js'

document.body.addEventListener("dragover", event => event.preventDefault())
document.body.addEventListener("drop", async event => {
    event.preventDefault()
    let id = Number((new URL(location.href)).searchParams.get("id"))
    let fileDicts = []
    for(let file of Object.values(event.dataTransfer.files)){
        let cleanedData = await CleanUp(id, file)
        fileDicts.push(await fileDict.compose(file, cleanedData))
    }

    sendResult(id, fileDicts)

    window.close()
})

async function sendResult(id, fileDicts){
    let key = crypto.randomUUID()
    await chrome.tabs.sendMessage(id, {type: "Result", key})
    let cs = new ChunkSender(key, fileDicts)
    await cs.chunkTabSendMessage(id)
}