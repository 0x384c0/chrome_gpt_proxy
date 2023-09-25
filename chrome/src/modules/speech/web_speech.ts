export { init, start, stop, recognizing };

let recognition: SpeechRecognition;
var recognizing = false;
var recognizedTranscript = ""

function init(onResult: (result: string) => void, onSpeechEnd: (result: string) => void, onStop: () => void) {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = function(event: SpeechRecognitionEvent) {
        recognizedTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i][0];
            const transcript = result.transcript;
            recognizedTranscript += transcript + ' ';
        }
        onResult(recognizedTranscript)
    };

    recognition.onstart = function () {
        recognizing = true;
    };
    
    recognition.onend = function () {
        onStop()
        recognizing = false;
        onSpeechEnd(recognizedTranscript)
    };
    
    recognition.onerror = function () {
        onStop()
        recognizing = false;
    };

    recognition.onspeechend = function() {
        recognition.stop()
    };
}


function start() {
    if (!recognizing) {
        recognition.start();
    }
}

function stop() {
    if (recognizing) {
        recognition.stop();
    }
}