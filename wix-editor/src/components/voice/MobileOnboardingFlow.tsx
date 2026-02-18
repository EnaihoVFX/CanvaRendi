'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    FaLayerGroup, FaMicrophoneLines, FaKeyboard, FaChevronRight, FaStop,
    FaInstagram, FaLinkedin, FaCheck, FaFont, FaBold
} from 'react-icons/fa6';
import styles from './MobileOnboardingFlow.module.css';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';

interface MobileOnboardingFlowProps {
    onComplete: (data: any) => void;
}

type StepType = 'voice' | 'sheet_input' | 'sheet_select' | 'sheet_multi' | 'loading';

interface Step {
    id: string;
    text: string;
    type: StepType;
    sheet?: {
        title: string;
        desc: string;
        content: 'socials' | 'themes' | 'logos' | 'features';
    };
}

const steps: Step[] = [
    {
        id: 'socials', text: "Do you have social media profiles to connect?", type: 'sheet_input',
        sheet: { title: "Connect Accounts", desc: "We'll pull your info automatically.", content: 'socials' }
    },

    { id: 'industry', text: "What industry is your business in?", type: 'voice' },

    { id: 'name', text: "What should we call your business?", type: 'voice' },

    { id: 'pitch', text: "In a few words, describe what makes it special.", type: 'voice' },

    {
        id: 'theme', text: "Which visual style fits best?", type: 'sheet_select',
        sheet: { title: "Select a Theme", desc: "Choose your foundation.", content: 'themes' }
    },

    {
        id: 'logo', text: "How should your logo look?", type: 'sheet_select',
        sheet: { title: "Logo Style", desc: "Pick a brand mark structure.", content: 'logos' }
    },

    {
        id: 'features', text: "What features do you need?", type: 'sheet_multi',
        sheet: { title: "Add Features", desc: "Select all that apply.", content: 'features' }
    },

    { id: 'done', text: "Generating your site...", type: 'loading' }
];

export default function MobileOnboardingFlow({ onComplete }: MobileOnboardingFlowProps) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [selections, setSelections] = useState<any>({ features: [] });
    const [transcriptText, setTranscriptText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Voice Agent
    const { isListening, isSpeaking, speak, startListening, stopListening, transcript } = useVoiceAgent({
        onTranscript: (text, isFinal) => {
            setTranscriptText(text);
            if (isFinal) {
                setTranscriptText("Processing...");
                setTimeout(() => {
                    handleVoiceInput(text);
                }, 1000);
            }
        }
    });

    const currentStep = steps[currentStepIdx];
    const aiTextRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // Speak initial prompt if voice step
        if (currentStep.type === 'voice') {
            speak(currentStep.text);
        }

        // Reset animation
        if (aiTextRef.current) {
            aiTextRef.current.classList.remove(styles.slideUpText);
            void aiTextRef.current.offsetWidth; // trigger reflow
            aiTextRef.current.classList.add(styles.slideUpText);
        }

        if (currentStep.type === 'loading') {
            setTimeout(() => {
                onComplete(selections);
            }, 3000);
        }
    }, [currentStepIdx]);

    const handleNext = () => {
        if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        }
    };

    const handleVoiceInput = (text: string) => {
        // Save data
        setSelections((prev: any) => ({ ...prev, [currentStep.id]: text }));
        handleNext();
    };

    const handleSheetSelect = (key: string, value: any, multi = false) => {
        if (multi) {
            setSelections((prev: any) => {
                const current = prev[key] || [];
                if (current.includes(value)) {
                    return { ...prev, [key]: current.filter((v: any) => v !== value) };
                }
                return { ...prev, [key]: [...current, value] };
            });
        } else {
            setSelections((prev: any) => ({ ...prev, [key]: value }));
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Render Helpers
    const renderSheetContent = () => {
        if (!currentStep.sheet) return null;
        const type = currentStep.sheet.content;

        if (type === 'socials') {
            return (
                <div className="space-y-4">
                    <div className={styles.socialInputGroup}>
                        <FaInstagram className="text-xl text-pink-600" />
                        <input
                            type="text"
                            placeholder="@username"
                            className="bg-transparent w-full outline-none text-sm font-medium"
                            onChange={(e) => setSelections({ ...selections, instagram: e.target.value })}
                        />
                    </div>
                    <div className={styles.socialInputGroup}>
                        <FaLinkedin className="text-xl text-blue-700" />
                        <input
                            type="text"
                            placeholder="LinkedIn URL"
                            className="bg-transparent w-full outline-none text-sm font-medium"
                            onChange={(e) => setSelections({ ...selections, linkedin: e.target.value })}
                        />
                    </div>
                    <button onClick={handleNext} className="text-xs text-gray-400 font-medium w-full text-center py-2">Skip this step</button>
                    <button onClick={handleNext} className="w-full bg-black text-white font-medium py-4 rounded-xl shadow-lg mt-2">Confirm & Continue</button>
                </div>
            );
        }

        if (type === 'themes') {
            const themes = [
                { name: 'Minimal', desc: 'Clean & Stark', color: 'bg-white border-gray-200' },
                { name: 'Bold', desc: 'High Contrast', color: 'bg-gray-900 border-gray-900 text-white' }, // Handle text color in map
                { name: 'Elegant', desc: 'Serif & Soft', color: 'bg-[#fdfbf7] border-[#e5e7eb]' },
                { name: 'Organic', desc: 'Nature Tones', color: 'bg-emerald-50 border-emerald-100' }
            ];
            return (
                <div className="space-y-3">
                    {themes.map(t => (
                        <button
                            key={t.name}
                            onClick={() => handleSheetSelect('theme', t.name)}
                            className={`${styles.optionCard} ${selections.theme === t.name ? styles.selected : ''} ${t.color.includes('bg-gray-900') ? 'text-white' : ''} ${t.color}`}
                        >
                            <div>
                                <div className={`font-bold ${t.name === 'Bold' ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                                <div className={`text-xs ${t.name === 'Bold' ? 'text-gray-400' : 'text-gray-500'}`}>{t.desc}</div>
                            </div>
                            {selections.theme === t.name && (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <FaCheck className="text-[10px] text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                    <button onClick={handleNext} className="w-full bg-black text-white font-medium py-4 rounded-xl shadow-lg mt-4">Confirm & Continue</button>
                </div>
            );
        }

        if (type === 'logos') {
            const logos = [
                { name: 'Wordmark', icon: FaFont },
                { name: 'Icon + Text', icon: FaLayerGroup },
                { name: 'Monogram', icon: FaBold }
            ];
            return (
                <div className="space-y-3">
                    {logos.map(l => (
                        <button
                            key={l.name}
                            onClick={() => handleSheetSelect('logo', l.name)}
                            className={`${styles.optionCard} ${selections.logo === l.name ? styles.selected : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                                    <l.icon />
                                </div>
                                <span className="font-medium text-gray-900">{l.name}</span>
                            </div>
                            {selections.logo === l.name && (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <FaCheck className="text-[10px] text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                    <button onClick={handleNext} className="w-full bg-black text-white font-medium py-4 rounded-xl shadow-lg mt-4">Confirm & Continue</button>
                </div>
            );
        }

        if (type === 'features') {
            const features = ['Sell Products', 'Blog / News', 'Appointments', 'Portfolio', 'Testimonials', 'Contact Form'];
            return (
                <div className="space-y-3">
                    {features.map(f => (
                        <button
                            key={f}
                            onClick={() => handleSheetSelect('features', f, true)}
                            className={`${styles.optionCard} ${selections.features.includes(f) ? styles.selected : ''}`}
                        >
                            <span className="font-medium text-gray-900">{f}</span>
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${selections.features.includes(f) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                                {selections.features.includes(f) && <FaCheck className="text-white text-[10px]" />}
                            </div>
                        </button>
                    ))}
                    <button onClick={handleNext} className="w-full bg-black text-white font-medium py-4 rounded-xl shadow-lg mt-4">Generate Site</button>
                </div>
            );
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center z-20 bg-white/80 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-2">
                    <FaLayerGroup className="text-emerald-600 text-lg" />
                    <span className={`${styles.fontSerifDisplay} font-bold text-lg tracking-tight`}>SiteApe</span>
                </div>
                <div className="flex gap-1">
                    {steps.map((_, i) => (
                        // Don't show pills for loading step? User HTML shows 6 pills. steps has 8? 
                        // User HTML has 6 pills. Let's limit or map logic.
                        // Let's just map all steps excluding 'done' which is loading.
                        i < steps.length - 1 && (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= currentStepIdx ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            ></div>
                        )
                    ))}
                </div>
            </header>

            {/* Main Stage */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 -mt-20 transition-all duration-500"
                style={{
                    opacity: currentStep.type.startsWith('sheet') ? 0.5 : 1,
                    transform: currentStep.type.startsWith('sheet') ? 'scale(0.95)' : 'scale(1)'
                }}
            >
                <div
                    className={`${styles.visualizerContainer} ${isListening ? styles.listening : isSpeaking ? styles.speaking : ''} ${currentStep.type === 'loading' ? styles.loadingState : ''} mb-8`}
                >
                    <div className={`${styles.circle} ${styles.c1}`}></div>
                    <div className={`${styles.circle} ${styles.c2}`}></div>
                    <div className={styles.avatarCore}>
                        {currentStep.type === 'loading' ? <FaLayerGroup /> : isListening ? <FaStop /> : <FaMicrophoneLines />}
                    </div>
                </div>

                <div className="text-center w-full space-y-4 min-h-[140px]">
                    <h1 ref={aiTextRef} className={`${styles.fontSerifDisplay} text-3xl font-medium leading-tight text-gray-900 ${styles.slideUpText}`}>
                        {currentStep.text}
                    </h1>
                    <p className="text-emerald-600 font-medium text-lg min-h-[28px] transition-opacity" style={{ opacity: isListening ? 1 : 0 }}>
                        {transcript || transcriptText || "Listening..."}
                    </p>
                </div>
            </main>

            {/* Voice Controls (Footer) */}
            <footer
                className={styles.footerControls}
                style={{ transform: currentStep.type.startsWith('sheet') || currentStep.type === 'loading' ? 'translateY(100%)' : 'translateY(0)' }}
            >
                <div className="flex justify-center gap-6 items-center mb-8">
                    <button className="p-4 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition shadow-sm">
                        <FaKeyboard />
                    </button>

                    <button
                        onClick={toggleListening}
                        className={styles.micBtn}
                    >
                        {isListening ? <FaStop /> : <FaMicrophoneLines />}
                    </button>

                    <button onClick={handleNext} className="p-4 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition shadow-sm">
                        <FaChevronRight />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">Tap to speak</p>
            </footer>

            {/* Bottom Sheet */}
            <div
                className={`${styles.bottomSheet} ${currentStep.type.startsWith('sheet') ? styles.active : ''}`}
            >
                <div className="w-full flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                </div>

                <div className="px-6 pb-4 border-b border-gray-50">
                    <h3 className={`${styles.fontSerifDisplay} text-2xl font-medium`}>{currentStep.sheet?.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">{currentStep.sheet?.desc}</p>
                </div>

                <div className={styles.sheetContent}>
                    {renderSheetContent()}
                </div>
            </div>
        </div>
    );
}
