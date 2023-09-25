import { ChatInteractor } from '../chat_interactor'

export class ChatGptInteractor implements ChatInteractor {

    get isGenerating(): boolean {
        return this.getStopButton() != undefined
    }

    clear(){
        this.getTextArea().value = ""
        this.triggerTextInputEvent()
    }

    paste(text: string){
        this.getTextArea().value = text
        this.triggerTextInputEvent()
    }

    send(){
        if (this.getTextArea().value != "" && !this.isGenerating) {
            const sendButton = document.querySelector('button[data-testid="send-button"]') as HTMLButtonElement;
            sendButton!.click()
        }
    }

    stopGenerating(){
        this.getStopButton()?.click()
    }

    // private
    getStopButton(): HTMLButtonElement | undefined {
        var result: HTMLButtonElement | undefined
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            if (button.textContent === 'Stop generating') {
                result = button
            }
        });
        return result
    }

    getTextArea(): HTMLTextAreaElement {
        return document.getElementById("prompt-textarea") as HTMLTextAreaElement
    }

    triggerTextInputEvent(){
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
        this.getTextArea().dispatchEvent(inputEvent);
    }
}



