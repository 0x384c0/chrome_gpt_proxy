export class SpeechRecognitionService {
    recognizing = false;
    private recognition: SpeechRecognition;
    private recognizedTranscript = '';

    constructor(
        private lang: SpeechRecognitionLang,
        private onInterimResult: (result: string) => void,
        private onFullResult: (result: string) => void,
        private onStart: () => void,
        private onStop: () => void
    ) {
        this.recognition =
            new (window['webkitSpeechRecognition'] || window['SpeechRecognition'])();
        this.recognition.lang = lang;
        this.recognition.interimResults = true;
        this.recognition.continuous = true;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            this.recognizedTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i][0];
                const transcript = result.transcript;
                this.recognizedTranscript += transcript + ' ';
            }
            this.onInterimResult(this.recognizedTranscript);
        };

        this.recognition.onstart = () => {
            this.recognizing = true;
            this.onStart();
        };

        this.recognition.onend = () => {
            this.recognizing = false;
            this.onFullResult(this.recognizedTranscript);
            this.onStop();
        };

        this.recognition.onerror = (e) => {
            console.error(e)
            this.recognizing = false;
            this.onStop();
        };
    }

    public start() {
        if (!this.recognizing) {
            this.recognition.start();
        }
    }

    public stop() {
        if (this.recognizing) {
            this.recognition.stop();
        }
    }

    public isRecognizing() {
        return this.recognizing;
    }
}

export enum SpeechRecognitionLang {
    English = 'en-US',
    Russian = 'ru-RU',
}