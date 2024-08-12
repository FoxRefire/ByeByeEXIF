export default {
    decode: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
    encode: b => btoa(Array.from(new Uint8Array(b)).map(e => String.fromCharCode(e)).join(""))
}
