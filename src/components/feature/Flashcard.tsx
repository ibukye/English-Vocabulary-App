"use client";

import { useState } from "react"
//import SpeakerButton from "../ui/SpeakerButton";
import './Flashcard.css';
import SpeakerButton from "../ui/SpeakerButton";

// 学習モードの型
type StudyMode = 'en-jp' | 'jp-en';

// Flashcardが受け取るデータの型
type WordData = {
    word: string;
    meaning: string;
    example?: string;   // 任意  
    memo?: string;
    mistakeCount: number;
    lastCorrectDate?: Date | null;
}

// ComponentのPropsの型
type FlashcardProps = { 
    wordData: WordData; 
    isFlipped?: boolean;    
    onFlip?: () => void;
    mode?: string;
}

export default function Flashcard({ wordData, isFlipped: controlledFlipped, onFlip, mode='en-jp' }: FlashcardProps) {
    // Internal flipped control
    const [internalFlipped, setInternalFlipped] = useState(false);
    // Priority external > internal
    const isFlipped = controlledFlipped ?? internalFlipped;

    const handleFlip = () => {
        if (onFlip) { onFlip(); }   // 渡されているなら
        else { setInternalFlipped(prev => !prev); }
    }

    const frontContent = mode === 'en-jp' ? wordData.word : wordData.meaning;
    const backContent = mode === 'en-jp' ? wordData.meaning : wordData.word;


    return (
        <div className="flashcard-container" onClick={handleFlip}>
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>



                {/* カードの表面 */}
                <div className="flashcard-front">
                    <h2>{frontContent}</h2>
                    {/* EN→JPモードのときだけ音声ボタンを表示 */}
                    {mode === 'en-jp' && <SpeakerButton textToSpeak={wordData.word} />}
                    {/* 例文が存在する場合のみ表示 */}
                    {mode==='en-jp' && wordData.example && <p className="example"><em>{wordData.example}</em></p>}
                </div>



                {/* カードの裏面 */}
                <div className="flashcard-back">
                    <h2>{backContent}</h2>
                    {/* 例文が存在する場合のみ表示 */}
                    {mode==='jp-en' && wordData.example && <p className="example"><em>{wordData.example}</em></p>}
                    {wordData.memo && <p className="memo"><em>{wordData.memo}</em></p>}

                </div>
            


            </div>
        </div>
    );
};