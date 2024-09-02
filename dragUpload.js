import CleanUp from './utils/cleanup.js';
import fileDict from './utils/fileDict.js'

document.body.addEventListener("dragover", event => event.preventDefault())
document.body.addEventListener("drop", async event => {
    event.preventDefault()
    let id = Number((new URL(location.href)).searchParams.get("id"))
    let fileDicts = []
    for(let file of Object.values(event.dataTransfer.files)){
        let cleanedData = await CleanUp(id, file)
        fileDicts.push(await fileDict.compose(file, cleanedData))
    }

    await chrome.tabs.sendMessage(id, {
        type: "Result",
        fileDict: fileDicts
    })

    window.close()
})
