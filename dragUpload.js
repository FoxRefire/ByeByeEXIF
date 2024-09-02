import CleanUp from './utils/cleanup.js';
import fileDict from './utils/fileDict.js'

document.body.addEventListener("dragover", event => event.preventDefault())
document.body.addEventListener("drop", async event => {
    event.preventDefault()
    let id = Number((new URL(location.href)).searchParams.get("id"))
    let file = event.dataTransfer.files[0]
    let cleanedData = await CleanUp(id, file)

    await setIndex(id)
    await chrome.tabs.sendMessage(id, {
        type: "Result",
        fileDict: await fileDict.compose(file, cleanedData)
    })

    window.close()
})

async function setIndex(id){
    let res = await chrome.tabs.sendMessage(id, {type:"Index"})
    if(res) return res
    throw res
}