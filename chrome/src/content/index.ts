import divHtml from './page.html?raw'
import { SpeechRecognitionLang, SpeechRecognitionService } from '../modules/speech/speech_recognition_service'
import { ChatInteractor } from '../modules/interactors/chat_interactor';
import { ChatGptInteractor } from '../modules/interactors/chat_gpt/chat_gpt_interactor';
import { BingChatInteractor } from '../modules/interactors/bing_chat/bing_chat_interactor';

class ContentScript {
    // State
    private isHotkeysEnabled = false
    private sendMessageAfterStop = false
    private selectedLanguage = SpeechRecognitionLang.English

    // UI
    private focus_area!: HTMLDivElement
    private start_button!: HTMLButtonElement
    private stop_and_send_button!: HTMLButtonElement
    private stop_button!: HTMLButtonElement
    private language_select!: HTMLSelectElement
    private language_select_container!: HTMLDivElement

    // Utils
    private chatInteractor!: ChatInteractor
    private webSpeech!: SpeechRecognitionService

    // Functions
    private addPage() {
        var container = document.createElement('div');
        container.innerHTML = divHtml;
        var redDiv = container.firstChild;
        document.body.appendChild(redDiv!);
    }

    private restorePage() {
        let element = document.getElementById('interview-helper-controls');
        if (element) {
            element.style.display = 'block';
        }
    }

    private initUI() {
        this.focus_area = document.querySelector('#focus_area')!
        this.start_button = document.querySelector('#start_button')!
        this.stop_and_send_button = document.querySelector('#stop_and_send_button')!
        this.stop_button = document.querySelector('#stop_button')!
        this.language_select = document.querySelector('#language_select')!
        this.language_select_container = document.querySelector('#language_select_container')!
    }

    private initFocusArea() {
        this.focus_area.onmouseover = () => {
            this.isHotkeysEnabled = true
        }
        this.focus_area.onmouseleave = () => {
            this.isHotkeysEnabled = false
        }
    }

    private initLangPicker() {
        this.language_select.value = this.selectedLanguage
        this.language_select.onchange = () => {
            switch (this.language_select.value) {
                case 'en-US':
                    this.selectedLanguage = SpeechRecognitionLang.English
                case 'ru-RU':
                    this.selectedLanguage = SpeechRecognitionLang.Russian
            }
            this.initSpeechRecognition()
        }
    }

    private initClickListeners() {
        this.start_button.addEventListener('click', this.onStartClick.bind(this))
        this.stop_and_send_button.addEventListener('click', this.onStopAndSendClick.bind(this))
        this.stop_button.addEventListener('click', this.onStopClick.bind(this))
    }

    private initKeyListeners() {
        window.onkeyup = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.restorePage()
                    if (this.webSpeech.recognizing) {
                        this.onStopClick()
                    } else if (this.isHotkeysEnabled) {
                        this.onStartClick()
                    }
                    break;
                case 'ArrowRight':
                    if (this.isHotkeysEnabled) {
                        if (this.webSpeech.recognizing) {
                            this.onStopAndSendClick()
                        } else {
                            this.chatInteractor.send()
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if (this.isHotkeysEnabled && this.webSpeech.recognizing)
                        this.onStopClick()
                    break;
            }
        }
    }

    private initCommandListeners() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (!this.isHotkeysEnabled)
                switch (message) {
                    case 'start_stop_speech_recognizing':
                        this.restorePage()
                        if (this.webSpeech.recognizing) {
                            this.onStopClick()
                        } else {
                            this.onStartClick()
                        }
                        break
                    case 'stop_speech_recognizing_and_send':
                        if (this.webSpeech.recognizing) {
                            this.onStopAndSendClick()
                        } else {
                            this.chatInteractor.send()
                        }
                        break
                    case 'stop_speech_recognizing':
                        if (this.webSpeech.recognizing)
                            this.onStopClick()
                        break
                }
            return true
        })
    }

    // UI Events
    private onStartClick() {
        this.sendMessageAfterStop = false
        this.webSpeech.start()
        console.log("onStartClick")
    }

    private onStopAndSendClick() {
        this.sendMessageAfterStop = true
        this.webSpeech.stop()
    }

    private onStopClick() {
        this.sendMessageAfterStop = false
        this.webSpeech.stop()
    }

    // Sppech events
    private onSpeechInterimResult(result: string) {
        this.chatInteractor.paste(result)
    }


    private onSpeechFullResult(finalMessage: string) {
        if (!this.chatInteractor.isGenerating) {
            this.chatInteractor.paste(finalMessage)
            if (this.sendMessageAfterStop) {
                this.chatInteractor.send()
            }
        }
    }

    private onSpeechStart() {
        this.language_select_container.hidden = true
        this.start_button.hidden = true
        this.stop_and_send_button.hidden = false
        this.stop_button.hidden = false
    }

    private onSpeechStop() {
        this.language_select_container.hidden = false
        this.start_button.hidden = false
        this.stop_and_send_button.hidden = true
        this.stop_button.hidden = true
    }

    private initSpeechRecognition() {
        this.webSpeech = new SpeechRecognitionService(
            this.selectedLanguage,
            this.onSpeechInterimResult.bind(this),
            this.onSpeechFullResult.bind(this),
            this.onSpeechStart.bind(this),
            this.onSpeechStop.bind(this),
        )
    }

    private initChatInteractor() {
        switch (true) {
            case window.location.href.includes('bing.com'):
                this.chatInteractor = new BingChatInteractor();
                break;
            case window.location.href.includes('chat.openai.com'):
                this.chatInteractor = new ChatGptInteractor();
                break;
        }
    }

    // Main
    constructor() {
        this.initChatInteractor()
        this.initSpeechRecognition()
        this.addPage()
        this.initUI()
        this.initClickListeners()
        this.initLangPicker()
        this.initFocusArea()
        this.initKeyListeners()
        this.initCommandListeners()
        this.onSpeechStop()
    }
}


const baseURL = window.location.origin;
if (typeof keyValueVariable! === 'undefined') {
    var keyValueVariable: { [key: string]: ContentScript } = {};
}
const key = baseURL;
const instance = new ContentScript();
keyValueVariable[key] = instance;