const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB

export class ChunkSender {
    constructor(key, message) {
        this.key = key;
        this.message = JSON.stringify(message);
        this.chunks = Array.from({ length: Math.ceil(this.message.length / CHUNK_SIZE) }, (_, i) =>
            this.message.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
        );
    }

    async chunkRuntimeSendMessage() {
        let promises = [];
        await chrome.runtime.sendMessage({
            type: "_open",
            key: this.key,
            total: this.chunks.length
        })
        for(let i = 0; i < this.chunks.length; i++) {
            promises.push(chrome.runtime.sendMessage({
                type: "_chunk",
                chunk: this.chunks[i],
                index: i,
                key: this.key
            }));
        }
        return Promise.all(promises);
    }

    async chunkTabSendMessage(tabId) {
        let promises = [];
        await chrome.tabs.sendMessage(tabId, {
            type: "_open",
            key: this.key,
            total: this.chunks.length
        })
        for(let i = 0; i < this.chunks.length; i++) {
            promises.push(chrome.tabs.sendMessage(tabId, {
                type: "_chunk",
                chunk: this.chunks[i],
                index: i,
                key: this.key
            }));
        }
        return Promise.all(promises);
    }    
}

export class ChunkReceiver {
    constructor(key) {
        this.key = key;
        this.chunks = [];
        this.message;
    }

    chunkRuntimeReceiveMessage() {
        let total;
        return new Promise(resolve => {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if(message.type == "_open" && message.key == this.key) {
                    console.log("debug", message)
                    total = message.total;
                    sendResponse(true);
                }
                if(message.type == "_chunk" && message.key == this.key) {
                    console.log("debug", message)
                    this.chunks.push(message);
                    if(this.chunks.length == total) {
                        this.message = this.chunks.sort((a, b) => a.index - b.index).map(obj => obj.chunk).join("");
                        resolve(JSON.parse(this.message));
                    }
                    sendResponse(true);
                }
            })
        });
    }
}