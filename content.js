const b64 = {
    decode: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
    encode: b => btoa(Array.from(new Uint8Array(b)).map(e => String.fromCharCode(e)).join(""))
};

function dictToFile(dict){
    return new File([b64.decode(dict.data)], dict.name, {type: dict.type})
}

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
    return -1
}

function getElements(){
    if(!window.fileSelectors){
        window.fileSelectors = document.querySelectorAll('input[type="file"]')
    }
    return window.fileSelectors
}

function openFileChooser(){
    let input = document.createElement('input');
    input.type = "file"
    input.click()
    return new Promise(resolve => {
        input.addEventListener("change", async () => {
            resolve({
                name: input.files[0].name,
                type: input.files[0].type,
                data: b64.encode((await input.files[0].arrayBuffer()))
            })
        })
    })
}

function uploadResult(file, index){
    let dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    getElements()[index].files = dataTransfer.files
    getElements()[index].dispatchEvent(new Event("change"))
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type){
        case "Index":
            setIndex(getElements())
            sendResponse(true)
            break;
        case "Files":
            openFileChooser().then(files => sendResponse(files))
            break;
        case "Result":
            uploadResult(dictToFile(request.fileDict), window.fileIndex)
            sendResponse(true)
            break;
        case "Error":
            alert("Unsuppoted file format")
            sendResponse(true)
    }
    return true
})
