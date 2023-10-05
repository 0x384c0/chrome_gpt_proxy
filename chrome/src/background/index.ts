function initCommandListeners() {
    chrome.commands.onCommand.addListener((command) => {
        chrome.tabs.query({ url: ['https://chat.openai.com/*', 'https://www.bing.com/*', 'chrome-extension://*/src/options/index.html'], active: true }, (tabs) => {
            tabs.forEach(async tab => {
                await chrome.tabs.sendMessage(tab.id!, command)    
            })
        })
    })
}

initCommandListeners()

export { }
