/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Declare support for speech recognition types globally

interface Window
{
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

declare var SpeechRecognition: {
    new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    new(): SpeechRecognition;
};

interface SpeechRecognition extends EventTarget
{
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;

    onaudioend?: (this: SpeechRecognition, ev: Event) => void;
    onaudiostart?: (this: SpeechRecognition, ev: Event) => void;
    onend?: (this: SpeechRecognition, ev: Event) => void;
    onerror?: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void;
    onnomatch?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => void;
    onresult?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => void;
    onsoundend?: (this: SpeechRecognition, ev: Event) => void;
    onsoundstart?: (this: SpeechRecognition, ev: Event) => void;
    onspeechend?: (this: SpeechRecognition, ev: Event) => void;
    onspeechstart?: (this: SpeechRecognition, ev: Event) => void;
    onstart?: (this: SpeechRecognition, ev: Event) => void;
}

interface SpeechRecognitionEvent extends Event
{
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList
{
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult
{
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    length: number;
}

interface SpeechRecognitionAlternative
{
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event
{
    error: string;
    message: string;
}
