import divHtml from './page.html?raw'
import * as web_speech from '../modules/speech/web_speech'
import { ChatInteractor } from '../modules/interactors/chat_interactor';
import { ChatGptInteractor } from '../modules/interactors/chat_gpt/chat_gpt_interactor';

function addPage() {
    var container = document.createElement('div');
    container.innerHTML = divHtml;
    var redDiv = container.firstChild;
    document.body.appendChild(redDiv!);
}

function getButton(){
    return document.querySelector('#listen_button')
}

function addClickListener(){ // TODO: press and release
    const button = getButton()
    button?.addEventListener('click', () => {
        if (web_speech.recognizing){
            web_speech.stop()
            resetButton()
        } else {
            web_speech.start()
            button.textContent = `Stop`
        }
    })
}

function writeToOutput(result:string){
    chatInteractor.paste(result)
}

function resetButton(){
    const button = getButton()
    button!.textContent = `Start`
}


addPage()
addClickListener()

let chatInteractor: ChatInteractor = new ChatGptInteractor()


function sendMessage(finalMessage: string){
    chatInteractor.paste(finalMessage)
    chatInteractor.send()   
}

web_speech.init(writeToOutput, sendMessage, resetButton)