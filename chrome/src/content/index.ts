import divHtml from './page.html?raw'
import { SpeechRecognitionService } from '../modules/speech/speech_recognition_service'
import { ChatInteractor } from '../modules/interactors/chat_interactor';
import { ChatGptInteractor } from '../modules/interactors/chat_gpt/chat_gpt_interactor';


// State
var isHotkeysEnabled = false
var sendMessageAfterStop = false

// UI
var focus_area: HTMLDivElement
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
    focus_area = document.querySelector('#focus_area')!
    start_button = document.querySelector('#start_button')!
    stop_and_send_button = document.querySelector('#stop_and_send_button')!
    stop_button = document.querySelector('#stop_button')!
}

function initFocusArea() {
    focus_area.onmouseover = function () {
        isHotkeysEnabled = true
    }
    focus_area.onmouseleave = function () {
        isHotkeysEnabled = false
    }
}

function initClickListeners() {
    start_button.addEventListener('click', onStartClick)
    stop_and_send_button.addEventListener('click', onStopAndSendClick)
    stop_button.addEventListener('click', onStopClick)
}

function initKeyHandlers() {
    window.onkeyup = function (e) {
        switch (e.key) {
            case 'ArrowUp':
                if (webSpeech.recognizing) {
                    onStopClick()
                } else if (isHotkeysEnabled) {
                    onStartClick()
                }
                break;
            case 'ArrowRight':
                if (isHotkeysEnabled) {
                    if (webSpeech.recognizing) {
                        onStopAndSendClick()
                    } else {
                        chatInteractor.send()
                    }
                }
                break;
        }
    }
}

// UI Events
function onStartClick() {
    sendMessageAfterStop = false
    webSpeech.start()
}

function onStopAndSendClick() {
    sendMessageAfterStop = true
    webSpeech.stop()
}

function onStopClick() {
    sendMessageAfterStop = false
    webSpeech.stop()
}

// Sppech events
function onSpeechInterimResult(result: string) {
    chatInteractor.paste(result)
}


function onSpeechFullResult(finalMessage: string) {
    if (!chatInteractor.isGenerating) {
        chatInteractor.paste(finalMessage)
        if (sendMessageAfterStop) {
            chatInteractor.send()
        }
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

let chatInteractor: ChatInteractor = new ChatGptInteractor()
let webSpeech = new SpeechRecognitionService(onSpeechInterimResult, onSpeechFullResult, onSpeechStart, onSpeechStop)

addPage()
initUI()
initClickListeners()
initFocusArea()
initKeyHandlers()
onSpeechStop()