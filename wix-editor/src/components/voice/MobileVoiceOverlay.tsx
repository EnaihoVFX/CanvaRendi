'use client';

import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaRegKeyboard, FaUser, FaRobot, FaXmark } from 'react-icons/fa6';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import VoiceVisualizer from './VoiceVisualizer';

interface MobileVoiceOverlayProps {
    isActive: boolean;
    stepId: string;
    onNext: (data?: any) => void;
    currentQuestion: string;
    transcript?: string;
}

export default function MobileVoiceOverlay({ isActive, stepId, onNext, currentQuestion, transcript: externalTranscript }: MobileVoiceOverlayProps) {
    const [isKeyboardMode, setIsKeyboardMode] = useState(false);
    const [inputText, setInputText] = useState('');

    // Voice Handling
    const handleVoiceResult = (text: string, isFinal: boolean) => {
        if (isFinal) {
            // Process input
            onNext(text);
        }
    };

    const { isListening, isSpeaking, speak, startListening, stopListening, transcript, error } = useVoiceAgent({
        onTranscript: handleVoiceResult
    });

    useEffect(() => {
        if (isActive && !isKeyboardMode) {
            // Speak question
            speak(currentQuestion, () => {
                startListening();
            });
        } else {
            stopListening();
        }
    }, [isActive, currentQuestion, isKeyboardMode]);

    const handleManualSubmit = () => {
        if (inputText.trim()) {
            onNext(inputText);
            setInputText('');
            setIsKeyboardMode(false);
        }
    };

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col items-center justify-between p-6 transition-opacity duration-300">
            {/* Header */}
            <div className="w-full flex justify-between items-center opacity-70">
                <span className="text-xs font-medium tracking-widest uppercase">AI Assistant</span>
                <button onClick={() => setIsKeyboardMode(!isKeyboardMode)} className="p-2 rounded-full bg-white/10">
                    <FaRegKeyboard />
                </button>
            </div>

            {/* Visualizer / Avatar */}
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <VoiceVisualizer isActive={isListening} isSpeaking={isSpeaking} />
                </div>

                {/* Dialogue */}
                <div className="w-full space-y-4 text-center">
                    <div className="text-xl font-light leading-relaxed">
                        {isSpeaking ? currentQuestion : (transcript || externalTranscript || "Listening...")}
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="w-full max-w-md pb-8">
                {isKeyboardMode ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your answer..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60"
                            autoFocus
                        />
                        <button
                            onClick={handleManualSubmit}
                            className="bg-white text-gray-900 rounded-full px-6 font-medium"
                        >
                            Send
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95 mx-auto ${isListening ? 'bg-red-500 text-white' : 'bg-white text-gray-900'
                            }`}
                    >
                        <FaMicrophone />
                    </button>
                )}

                {!isKeyboardMode && (
                    <p className="text-center text-xs text-white/40 mt-4">
                        Tap microphone to speak
                    </p>
                )}
            </div>
        </div>
    );
}
