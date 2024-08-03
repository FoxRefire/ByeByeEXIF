import '/libs/jszip.min.js'
export default async function(file){
    let zip = await loadDocument(file);
    let targets = [
        "docProps/app.xml",
        "docProps/core.xml",
        "docProps/custom.xml",
        "meta.xml"
    ]
    targets.forEach(f => clean(zip, f))

    return (await zip.generateAsync({type: "arraybuffer"}))
}

async function loadDocument(file){
    let zip = new JSZip()
    let originalData = await file.arrayBuffer()

    return (await zip.loadAsync(originalData))
}

function clean(zip, file){
    let replacements = {
        "docProps/app.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"></Properties>',
        "docProps/core.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></cp:coreProperties>',
        "meta.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.1"></office:document-meta>'
    }

    file in zip.files ? zip.remove(file) : null
    file in replacements ? zip.file(file, replacements[file]) : null
}
