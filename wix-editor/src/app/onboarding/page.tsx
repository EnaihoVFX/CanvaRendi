'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaLayerGroup, FaKeyboard, FaMicrophone, FaRobot, FaInstagram, FaLinkedin, FaWandMagicSparkles, FaChevronRight, FaBolt, FaCheck, FaArrowRight } from 'react-icons/fa6';
import styles from './Onboarding.module.css';
import BusinessNameGeneratorModal from '@/components/modals/BusinessNameGeneratorModal';

import { Page, CanvasElement, SiteTheme } from '@/types/editor';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useMobile } from '@/hooks/useMobile';
import MobileOnboardingFlow from '@/components/voice/MobileOnboardingFlow';
import { isDemoMode, DEMO_ONBOARDING } from '@/data/demoData';

// ...



// Define Step IDs
type StepId = 'step-std-1' | 'step-create-1' | 'step-create-2' | 'step-create-3' | 'step-design' | 'step-features';

// Text Content
const contentData: Record<StepId, { q: string; s: string; v: string }> = {
    'step-std-1': { q: "Let's start to build your brand.", s: "What is your business called?", v: "What is your business name?" },
    'step-create-1': { q: "What industry is this?", s: "Tell me the category (e.g., Coffee, Tech).", v: "What kind of business do you want to start?" },
    'step-create-2': { q: "Let's name your business.", s: "Type a name or let AI generate one.", v: "What should we call your business?" },
    'step-create-3': { q: "The Elevator Pitch", s: "Describe your services, your passion, or what makes you unique...", v: "Tell me about your business idea." },
    'step-design': { q: "Pick a visual vibe.", s: "Which style suits you best?", v: "Describe the visual style you want." },
    'step-features': { q: "What features do you need?", s: "Select all that apply.", v: "What features do you need?" }
};


import { themeConfigs } from '@/lib/themes';
import { useUser, useClerk } from '@clerk/nextjs';
// Removed custom AuthModal imports
// Remove local ThemeConfig logic 

export default function OnboardingPage() {
    const router = useRouter();
    const isMobile = useMobile();
    const { isSignedIn, isLoaded } = useUser();
    const { openSignIn } = useClerk();

    // State
    const [isCreatorMode, setIsCreatorMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVoice, setIsVoice] = useState(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);

    // We don't need isAuthModalOpen anymore, Clerk handles the modal state.

    // Check Auth automatically
    React.useEffect(() => {
        if (isLoaded && !isSignedIn) {
            // Trigger Clerk's native modal
            openSignIn({
                afterSignInUrl: '/onboarding',
                afterSignUpUrl: '/onboarding',
                appearance: {
                    variables: { colorPrimary: '#000000' } // Optional: Match our theme
                }
            });
        }
    }, [isLoaded, isSignedIn, openSignIn]);


    const [businessName, setBusinessName] = useState('');
    const [industry, setIndustry] = useState('');
    const [pitch, setPitch] = useState('');
    const [vibe, setVibe] = useState('');
    const [features, setFeatures] = useState<string[]>([]);

    const stdSteps: StepId[] = ['step-std-1', 'step-create-1', 'step-create-3', 'step-design', 'step-features'];
    const creatorSteps: StepId[] = ['step-create-1', 'step-create-2', 'step-create-3', 'step-design', 'step-features'];
    const steps = isCreatorMode ? creatorSteps : stdSteps;

    const currentStepId = steps[currentIndex] || steps[0];

    // Voice Agent
    const handleVoiceTranscript = (text: string, isFinal: boolean) => {
        if (!isFinal || !isVoice) return;

        console.log('Voice Answer:', text);
        const lowerText = text.toLowerCase();

        // Simple Intent Matching based on current step
        if (currentStepId === 'step-std-1' || currentStepId === 'step-create-2') {
            setBusinessName(text.replace(/\.$/, '')); // Remove trailing period
            setTimeout(() => handleNext(), 1000); // Auto advance
        } else if (currentStepId === 'step-create-1') {
            setIndustry(text.replace(/\.$/, ''));
            setTimeout(() => handleNext(), 1000);
        } else if (currentStepId === 'step-create-3') {
            setPitch(text);
            setTimeout(() => handleNext(), 1000);
        } else if (currentStepId === 'step-design') {
            // Try to map spoken vibe to options
            const options = ['Minimal', 'Bold', 'Elegant', 'Playful', 'Cozy', 'Industrial', 'Nature'];
            const match = options.find(opt => lowerText.includes(opt.toLowerCase()));
            if (match) {
                setVibe(match);
                speak(`Selected ${match} style.`);
                setTimeout(() => handleNext(), 1500);
            } else {
                speak("I didn't catch that style. Please say one of the options.");
            }
        } else if (currentStepId === 'step-features') {
            // "I need a blog and a store"
            const extracted: string[] = [];
            if (lowerText.includes('blog')) extracted.push('Blog');
            if (lowerText.includes('store') || lowerText.includes('shop')) extracted.push('Online Store');
            if (lowerText.includes('booking')) extracted.push('Bookings');
            if (lowerText.includes('portfolio')) extracted.push('Portfolio');
            if (lowerText.includes('contact')) extracted.push('Contact Form');

            if (extracted.length > 0) {
                setFeatures(prev => Array.from(new Set([...prev, ...extracted])));
                speak(`Added ${extracted.join(' and ')}.`);
                // Don't auto advance immediately for multi-select, maybe wait for "Done" or "Next"?
                if (lowerText.includes('next') || lowerText.includes('done') || lowerText.includes('continue')) {
                    setTimeout(() => handleNext(), 1000);
                }
            } else if (lowerText.includes('next') || lowerText.includes('done') || lowerText.includes('continue')) {
                setTimeout(() => handleNext(), 1000);
            }
        }
    };

    const { isListening, isSpeaking, speak, startListening, stopListening, transcript, error } = useVoiceAgent({
        onTranscript: handleVoiceTranscript
    });

    // Effect to start speaking when step changes in Voice Mode
    React.useEffect(() => {
        if (isVoice) {
            const question = contentData[currentStepId]?.v;
            if (question) {
                // Determine delayed start to allow render
                const timeout = setTimeout(() => {
                    speak(question, () => {
                        // Start listening after speaking
                        startListening();
                    });
                }, 500);
                return () => clearTimeout(timeout);
            }
        } else {
            stopListening();
        }
    }, [currentStepId, isVoice, speak, startListening, stopListening]);

    const startVoiceMode = () => {
        setIsVoice(true);
    };

    const stopVoiceMode = () => {
        setIsVoice(false);
        stopListening();
    };

    const handleNext = async () => {
        if (!isSignedIn) {
            openSignIn(); // Use native modal
            return;
        }

        // DEMO FLOW: Auto-fill and skip straight to media selection
        if (currentStepId === 'step-std-1' && isDemoMode(businessName)) {
            console.log('[DEMO] Detected Daisy Rose Garden — fast-tracking to media selection');
            const params = new URLSearchParams({
                name: businessName.trim(),
                industry: DEMO_ONBOARDING.industry,
                vibe: DEMO_ONBOARDING.vibe,
                pitch: DEMO_ONBOARDING.pitch,
                features: DEMO_ONBOARDING.features.join(','),
                demo: 'true'
            });
            router.push(`/media-selection?${params.toString()}`);
            return;
        }

        if (currentIndex < steps.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            console.log('Finished onboarding, going to media selection');
            // Store state in URL params or localStorage
            const params = new URLSearchParams({
                name: businessName,
                industry: industry,
                vibe: vibe,
                pitch: pitch,
                features: features.join(',')
            });
            router.push(`/media-selection?${params.toString()}`);
        }
    };

    const handleSkip = () => {
        handleNext(); // Or specific skip logic
    };

    if (isMobile) {
        return (
            <MobileOnboardingFlow
                onComplete={(data) => {
                    console.log('Mobile Flow Data:', data);
                    const params = new URLSearchParams({
                        name: data.name || 'My Brand',
                        industry: data.industry || 'General',
                        vibe: data.theme || 'Minimal',
                        pitch: data.pitch || '',
                        features: (data.features || []).join(',')
                    });

                    router.push(`/media-selection?${params.toString()}`);
                }}
            />
        );
    }

    return (
        <div className={styles.container}>
            {/* ... (keep existing progress bar & nav) */}

            {/* Main Content */}
            <main className={styles.interactionContainer}>
                <div className={styles.aiAvatar} onClick={() => setIsVoice(!isVoice)} style={{ cursor: 'pointer' }}>
                    {isVoice ? <FaMicrophone /> : <FaRobot />}
                </div>
                {!isVoice && (
                    <div style={{ marginBottom: 32 }}>
                        <h2 className={styles.questionText}>{contentData[currentStepId]?.q}</h2>
                        <p className={styles.subText}>{contentData[currentStepId]?.s}</p>
                    </div>
                )}

                {isVoice && (
                    <div className={styles.voiceContainer} style={{ textAlign: 'center', marginTop: 40 }}>
                        <div className={styles.voiceWave}>
                            {isListening ? (
                                <div style={{ fontSize: 60, color: '#ef4444', animation: 'pulse 1s infinite' }}><FaMicrophone /></div>
                            ) : isSpeaking ? (
                                <div style={{ fontSize: 60, color: '#3b82f6', animation: 'bounce 1s infinite' }}><FaRobot /></div>
                            ) : (
                                <div style={{ fontSize: 60, color: '#9ca3af' }}><FaMicrophone /></div>
                            )}
                        </div>
                        <h2 className={styles.voiceText} style={{ marginTop: 24, fontSize: 24, fontWeight: 600 }}>
                            {isSpeaking ? contentData[currentStepId]?.v : (transcript || "Listening...")}
                        </h2>
                        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

                        <button
                            onClick={stopVoiceMode}
                            style={{
                                marginTop: 40, padding: '10px 20px', borderRadius: 20, border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer'
                            }}>
                            Switch to Manual Mode
                        </button>
                    </div>
                )}

                {/* Voice View */}
                {/* ... */}

                {/* Voice View */}
                {/* Voice UI handled above in conditional */}

                {/* Chat Views (Steps) */}
                {!isVoice && (
                    <>
                        {/* Step Std 1 */}
                        {currentStepId === 'step-std-1' && (
                            <div className={`${styles.stepContent} ${styles.active}`}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Brand / Company Name</label>
                                    <div className={styles.nameGenWrapper} style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            className={styles.textInput}
                                            placeholder="Business Name"
                                            value={businessName}
                                            onChange={e => setBusinessName(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            className={styles.btnGenName}
                                            onClick={() => setIsNameModalOpen(true)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                padding: '0 16px',
                                                background: '#f3f4f6',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 8,
                                                fontWeight: 600,
                                                color: '#374151',
                                                cursor: 'pointer',
                                                fontSize: 13,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <FaBolt color="#059669" /> AI Idea
                                        </button>
                                    </div>
                                </div>
                                {/* ... (keep remainder of step-std-1) */}
                            </div>
                        )}

                        {/* Step Create 1: Industry */}
                        {currentStepId === 'step-create-1' && (
                            <div className={`${styles.stepContent} ${styles.active}`}>
                                <div className={styles.inputGroup}>
                                    <input
                                        className={styles.textInput}
                                        placeholder="e.g. Coffee Shop, Tech Startup"
                                        value={industry}
                                        onChange={e => setIndustry(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step Create 2: Name */}
                        {currentStepId === 'step-create-2' && (
                            <div className={`${styles.stepContent} ${styles.active}`}>
                                <div className={styles.inputGroup}>
                                    <input
                                        className={styles.textInput}
                                        placeholder="Business Name"
                                        value={businessName}
                                        onChange={e => setBusinessName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step Create 3: Pitch */}
                        {currentStepId === 'step-create-3' && (
                            <div className={`${styles.stepContent} ${styles.active}`}>
                                <div className={styles.inputGroup}>
                                    <textarea
                                        className={styles.textInput}
                                        placeholder="Describe your business, services, and goals..."
                                        value={pitch}
                                        onChange={e => setPitch(e.target.value)}
                                        rows={4}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step Design */}
                        {currentStepId === 'step-design' && (
                            <div className={`${styles.stepContent} ${styles.active}`}>
                                <div className={styles.designGrid}>
                                    {Object.keys(themeConfigs).map(style => (
                                        <div
                                            key={style}
                                            className={`${styles.designCard} ${vibe === style ? styles.selected : ''}`}
                                            onClick={() => setVibe(style)}
                                        >
                                            <div className={styles.palettePreview}>
                                                <div className={styles.colorDot} style={{ background: themeConfigs[style].preview[0], border: '1px solid #ddd' }} />
                                                <div className={styles.colorDot} style={{ background: themeConfigs[style].preview[1], border: '1px solid #ddd' }} />
                                                <div className={styles.colorDot} style={{ background: themeConfigs[style].preview[2], border: '1px solid #ddd' }} />
                                            </div>
                                            <h3 style={{ margin: 0, fontSize: 16 }}>{style}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step Features */}
                        {currentStepId === 'step-features' && (
                            <div className={`${styles.stepContent} ${styles.active}`}>
                                <div className={styles.featuresList}>
                                    {['Blog', 'Online Store', 'Bookings', 'Portfolio', 'Testimonials', 'Contact Form'].map(feat => (
                                        <div
                                            key={feat}
                                            className={`${styles.featureItem} ${features.includes(feat) ? styles.selected : ''}`}
                                            onClick={() => {
                                                setFeatures(prev => prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]);
                                            }}
                                        >
                                            <div className={styles.checkboxFake}>
                                                {features.includes(feat) && <FaCheck size={12} />}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Action Bar */}
            <div className={styles.actionBar}>
                <button className={styles.btnSkip} onClick={handleSkip}>Skip</button>
                <button className={styles.btnNext} onClick={handleNext}>
                    Continue <FaArrowRight />
                </button>
            </div>

            {/* Modals */}
            <BusinessNameGeneratorModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSelect={(name) => setBusinessName(name)}
                initialIndustry={industry}
            />
        </div>
    );
}
