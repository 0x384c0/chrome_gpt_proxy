import divHtml from './page.html?raw'
import * as web_speech from '../modules/speech/web_speech'

function addPage() {
    var container = document.createElement('div');
    container.innerHTML = divHtml;
    var redDiv = container.firstChild;
    document.body.appendChild(redDiv!);
}

function getButton(){
    return document.querySelector('#listen_button')
}

function addClickListener(){
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
    document.getElementById('listen_output')!.textContent = result;
}

function resetButton(){
    const button = getButton()
    button!.textContent = `Start`
}

addPage()
addClickListener()
web_speech.init(writeToOutput, resetButton)