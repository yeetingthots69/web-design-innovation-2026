"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypingEffectOptions {
    speed?: number;
    startDelay?: number;
    onComplete?: () => void;
}

/**
 * Custom hook to simulate text streaming in character-by-character
 * Used for the Cụ Tuân AI Witness dialogue
 */
export function useTypingEffect(
    text: string,
    options: UseTypingEffectOptions = {}
) {
    const { speed = 30, startDelay = 0, onComplete } = options;
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const reset = useCallback(() => {
        setDisplayedText("");
        setIsTyping(false);
        setIsComplete(false);
    }, []);

    const skipToEnd = useCallback(() => {
        setDisplayedText(text);
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
    }, [text, onComplete]);

    useEffect(() => {
        if (!text) {
            reset();
            return;
        }

        setIsTyping(true);
        setIsComplete(false);
        setDisplayedText("");

        const startTimeout = setTimeout(() => {
            let currentIndex = 0;

            const intervalId = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(intervalId);
                    setIsTyping(false);
                    setIsComplete(true);
                    onComplete?.();
                }
            }, speed);

            return () => clearInterval(intervalId);
        }, startDelay);

        return () => clearTimeout(startTimeout);
    }, [text, speed, startDelay, onComplete, reset]);

    return {
        displayedText,
        isTyping,
        isComplete,
        reset,
        skipToEnd,
    };
}
