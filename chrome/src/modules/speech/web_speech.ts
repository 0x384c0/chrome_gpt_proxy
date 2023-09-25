export { init, start, stop, recognizing };

let recognition: SpeechRecognition;
var recognizing = false;

function init(onResult: (result: string) => void, onStop: () => void) {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = function(event: SpeechRecognitionEvent) {
        const result = event.results[event.results.length - 1][0].transcript;
        onResult(result)
    };

    recognition.onstart = function () {
        recognizing = true;
    };
    
    recognition.onend = function () {
        onStop()
        recognizing = false;
    };
    
    recognition.onerror = function () {
        onStop()
        recognizing = false;
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };
}


function start() {
    if (!recognizing) {
        recognition.start();
        console.log('Speech recognition started.');
    }
}

function stop() {
    if (recognizing) {
        recognition.stop();
        console.log('Speech recognition stopped.');
    }
}