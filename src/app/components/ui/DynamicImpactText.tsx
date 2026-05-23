import { useState, useEffect } from "react";

// "Impact" translated into various world languages
const TRANSLATIONS = [
    { word: "Impact", lang: "English" },
    { word: "Impacto", lang: "Spanish" },
    { word: "影响", lang: "Chinese" },
    { word: "प्रभाव", lang: "Hindi" },
    { word: "تأثير", lang: "Arabic" },
    { word: "Влияние", lang: "Russian" },
    { word: "インパクト", lang: "Japanese" },
    { word: "Impacto", lang: "Portuguese" },
    { word: "প্রভাব", lang: "Bengali" },
    { word: "Auswirkung", lang: "German" },
    { word: "Effet", lang: "French" },
    { word: "영향", lang: "Korean" },
    { word: "Etki", lang: "Turkish" },
    { word: "Impatto", lang: "Italian" },
    { word: "ప్రభావం", lang: "Telugu" },
    { word: "Wpływ", lang: "Polish" },
    { word: "Вплив", lang: "Ukrainian" },
    { word: "Tác động", lang: "Vietnamese" },
    { word: "ผลกระทบ", lang: "Thai" },
    { word: "Dampak", lang: "Indonesian" },
    { word: "השפעה", lang: "Hebrew" },
    { word: "اثر", lang: "Urdu" },
    { word: "Επίδραση", lang: "Greek" },
    { word: "Impakt", lang: "Dutch" },
    { word: "Inverkan", lang: "Swedish" },
];

interface DynamicImpactTextProps {
    className?: string;
}

export function DynamicImpactText({ className }: DynamicImpactTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TRANSLATIONS.length);
        }, 600); // Slightly slower for readability of different scripts
        return () => clearInterval(interval);
    }, []);

    return (
        <span
            className={`inline-block text-center transition-all duration-300 ${className}`}
            style={{
                minWidth: "200px",
                verticalAlign: "middle"
            }}
            title={TRANSLATIONS[currentIndex].lang}
        >
            {TRANSLATIONS[currentIndex].word}
        </span>
    );
}
