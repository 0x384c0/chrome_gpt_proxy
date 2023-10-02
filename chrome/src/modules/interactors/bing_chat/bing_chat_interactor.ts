import { ChatInteractor } from '../chat_interactor'

export class BingChatInteractor implements ChatInteractor {

    get isGenerating(): boolean {
        return this.getStopButton() != undefined
    }

    clear() {
        this.getTextArea().value = ""
        this.triggerTextInputEvent()
    }

    paste(text: string) {
        this.getTextArea().value = text
        this.triggerTextInputEvent()
    }

    send() {
        if (this.getTextArea().value != "" && !this.isGenerating) {
            const sendButton = document.querySelector("#b_sydConvCont > cib-serp")?.shadowRoot?.querySelector("#cib-action-bar-main")?.shadowRoot?.querySelector("div > div.main-container > div > div.bottom-controls > div.bottom-right-controls > div.control.submit > cib-icon-button")?.shadowRoot?.querySelector("button")
            sendButton!.click()
        }
    }

    stopGenerating() {
        this.getStopButton()?.click()
    }

    // private
    getStopButton(): HTMLButtonElement | undefined {
        let element = document.querySelector("#b_sydConvCont > cib-serp")?.shadowRoot?.querySelector("#cib-action-bar-main")?.shadowRoot?.querySelector("div > cib-typing-indicator")?.shadowRoot?.querySelector("#stop-responding-button")
        return element instanceof HTMLButtonElement ? element : undefined;
    }

    getTextArea(): HTMLTextAreaElement {
        let element = document.querySelector('cib-serp')?.shadowRoot?.querySelector('cib-action-bar')?.shadowRoot?.querySelector('cib-text-input')?.shadowRoot?.querySelector('textarea')
        return element as HTMLTextAreaElement
    }

    triggerTextInputEvent() {
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        this.getTextArea().dispatchEvent(inputEvent);
    }
}



