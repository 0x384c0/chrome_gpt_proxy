export { init, start, stop, recognizing };

let recognition: SpeechRecognition;
var recognizing = false;
var recognizedTranscript = ""

function init(
    onInterimResult: (result: string) => void,
    onFullResult: (result: string) => void,
    onStart: () => void,
    onStop: () => void
) {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = function (event: SpeechRecognitionEvent) {
        recognizedTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i][0];
            const transcript = result.transcript;
            recognizedTranscript += transcript + ' ';
        }
        onInterimResult(recognizedTranscript)
    };

    recognition.onstart = function () {
        recognizing = true;
        onStart()
    };

    recognition.onend = function () {
        recognizing = false;
        onFullResult(recognizedTranscript)
        onStop()
    };

    recognition.onerror = function () {
        recognizing = false;
        onStop()
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