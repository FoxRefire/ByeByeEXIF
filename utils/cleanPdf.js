import '/libs/pdf-lib.min.js'
export default async function(file){
    const originalDoc = await loadDocument(file)
    const cleanDoc = await PDFLib.PDFDocument.create()

    for(let i=0; i<originalDoc.getPages().length; i++){
        [this.page] = await cleanDoc.copyPages(originalDoc, [i])
        i == 0 ? cleanDoc.addPage(this.page) : cleanDoc.insertPage(i-1, this.page)
    }

    return (await cleanDoc.save())
}

async function loadDocument(file){
    let ab = await file.arrayBuffer()
    let doc = await PDFLib.PDFDocument.load(ab)
    return doc
}
