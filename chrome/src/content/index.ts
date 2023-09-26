import divHtml from './page.html?raw'
import * as web_speech from '../modules/speech/web_speech' // TODO: to class
import { ChatInteractor } from '../modules/interactors/chat_interactor';
import { ChatGptInteractor } from '../modules/interactors/chat_gpt/chat_gpt_interactor';


// UI
var start_button: HTMLButtonElement
var stop_and_send_button: HTMLButtonElement
var stop_button: HTMLButtonElement

function addPage() {
    var container = document.createElement('div');
    container.innerHTML = divHtml;
    var redDiv = container.firstChild;
    document.body.appendChild(redDiv!);
}

function initUI() {
    start_button = document.querySelector('#start_button')!
    stop_and_send_button = document.querySelector('#stop_and_send_button')!
    stop_button = document.querySelector('#stop_button')!
}

function initClickListeners() {
    start_button.addEventListener('click', () => {
        sendMessageAfterStop = false
        web_speech.start()
    })
    stop_and_send_button.addEventListener('click', () => {
        sendMessageAfterStop = true
        web_speech.stop()
    })
    stop_button.addEventListener('click', () => {
        sendMessageAfterStop = false
        web_speech.stop()
    })
}

// Sppech events
function onSpeechInterimResult(result: string) {
    chatInteractor.paste(result)
}

var sendMessageAfterStop = false

function onSpeechFullResult(finalMessage: string) {
    chatInteractor.paste(finalMessage)
    if (sendMessageAfterStop) {
        chatInteractor.send()
    }
}

function onSpeechStart() {
    start_button.hidden = true
    stop_and_send_button.hidden = false
    stop_button.hidden = false
}

function onSpeechStop() {
    start_button.hidden = false
    stop_and_send_button.hidden = true
    stop_button.hidden = true
}

addPage()
initUI()
initClickListeners()
onSpeechStop()

let chatInteractor: ChatInteractor = new ChatGptInteractor()

web_speech.init(onSpeechInterimResult, onSpeechFullResult, onSpeechStart, onSpeechStop)