function initCommandListeners() {
    chrome.commands.onCommand.addListener((command) => {
        chrome.tabs.query({ url: ['https://chat.openai.com/*', 'https://www.bing.com/*', 'chrome-extension://*/src/options/index.html'], active: true }, (tabs) => {
            tabs.forEach(async tab => {
                try {
                    await chrome.tabs.sendMessage(tab.id!, command)   
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })
}

initCommandListeners()

export { }
