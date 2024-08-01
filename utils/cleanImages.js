export default async function(file){
    let img = await loadImage(file)

    const canvas = new OffscreenCanvas(img.width, img.height)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(img, 0, 0, img.width, img.height)

    return (await getCleanedBlob(canvas, file.type))
}

async function loadImage(file){
    let img = await createImageBitmap(new Blob([file]));
    return img
}

function getCleanedBlob(canvas, type){
    return new Promise(resolve => {
        canvas.convertToBlob({type: type}).then(blob => resolve(blob.arrayBuffer()))
    })
}
