'use client';

import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
    isActive: boolean;
    isSpeaking: boolean;
}

export default function VoiceVisualizer({ isActive, isSpeaking }: VoiceVisualizerProps) {
    // Simple CSS-based visualization for now

    return (
        <div className="flex justify-center items-center h-32 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className={`w-3 bg-white rounded-full transition-all duration-300 ${isActive || isSpeaking ? 'animate-pulse' : 'h-3 opacity-30'
                        }`}
                    style={{
                        height: isActive || isSpeaking ? `${Math.random() * 60 + 20}px` : '12px',
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: isSpeaking ? '0.5s' : '1s'
                    }}
                />
            ))}
        </div>
    );
}
