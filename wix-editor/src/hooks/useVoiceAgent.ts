import { useState, useEffect, useRef, useCallback } from 'react';

// Define types for Web Speech API (as they might not be in the environment)
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: (event: Event) => void;
    onend: (event: Event) => void;
    onerror: (event: any) => void;
    onresult: (event: any) => void;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionConstructor;
        webkitSpeechRecognition: SpeechRecognitionConstructor;
    }
}

interface UseVoiceAgentProps {
    onTranscript?: (transcript: string, isFinal: boolean) => void;
}

export function useVoiceAgent({ onTranscript }: UseVoiceAgentProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = useCallback(async (text: string, onEnd?: () => void) => {
        if (!isMounted.current) return;

        // Cancel any existing speech
        setIsSpeaking(true);
        window.speechSynthesis.cancel();

        try {
            const response = await fetch('/api/elevenlabs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch audio from ElevenLabs');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.onended = () => {
                if (isMounted.current) setIsSpeaking(false);
                if (onEnd) onEnd();
                URL.revokeObjectURL(url);
            };

            audio.onerror = (e) => {
                console.error('Audio playback error', e);
                if (isMounted.current) setIsSpeaking(false);
                URL.revokeObjectURL(url);
                // Fallback on playback error?
            };

            await audio.play();
        } catch (error) {
            console.warn('ElevenLabs TTS failed, falling back to browser TTS:', error);

            // Fallback to Browser TTS
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => {
                if (isMounted.current) setIsSpeaking(false);
                if (onEnd) onEnd();
            };
            utterance.onerror = (e) => {
                console.error('Browser TTS error', e);
                if (isMounted.current) setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const startListening = useCallback(async () => {
        setError(null);
        if (isListening) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Browser does not support speech recognition.');
            return;
        }

        // Explicitly request microphone permission first — this triggers the
        // browser's permission dialog before SpeechRecognition.start() runs.
        // Without this, some browsers silently deny access with "not-allowed".
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Release the stream immediately; SpeechRecognition manages its own audio
            stream.getTracks().forEach(track => track.stop());
        } catch (err) {
            console.error('Microphone permission denied', err);
            setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one sentence/pause
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            if (isMounted.current) setIsListening(true);
        };

        recognition.onend = () => {
            if (isMounted.current) setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (isMounted.current) {
                let errorMessage = event.error;
                if (event.error === 'not-allowed') {
                    errorMessage = 'Microphone access denied. Please enable microphone permissions in your browser settings.';
                } else if (event.error === 'no-speech') {
                    errorMessage = 'No speech detected. Please try again.';
                }
                setError(errorMessage);
                setIsListening(false);
            }
        };

        recognition.onresult = (event: any) => {
            if (!isMounted.current) return;

            let finalTrans = '';
            let interimTrans = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTrans += event.results[i][0].transcript;
                } else {
                    interimTrans += event.results[i][0].transcript;
                }
            }

            if (finalTrans) {
                setTranscript(finalTrans);
                if (onTranscript) onTranscript(finalTrans, true);
            }

            setInterimTranscript(interimTrans);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [isListening, onTranscript]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    return {
        isListening,
        isSpeaking,
        transcript,
        interimTranscript,
        error,
        startListening,
        stopListening,
        speak
    };
}
