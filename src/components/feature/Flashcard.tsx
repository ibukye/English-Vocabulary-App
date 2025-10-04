import { useState } from "react"
import SpeakerButton from "../ui/SpeakerButton";
import './Flashcard.css';

// Flashcardが受け取るデータの型
type WordData = {
    word: string;
    meaning: string;
    example?: string;   // 任意   
}

// ComponentのPropsの型
type FlashcardProps = { wordData: WordData; }

export default function Flashcard({ wordData }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    }


    return (
        <div className="flashcard-container" onClick={handleFlip}>
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>

                {/* カードの表面 */}
                <div className="flashcard-front">
                    <h2>{wordData.word}</h2>
                    <SpeakerButton />
                </div>

                {/* カードの裏面 */}
                <div className="flashcard-back">
                    <p>{wordData.meaning}</p>
                    {/* 例文が存在する場合のみ表示 */}
                    {wordData.example && <p className="example"><em>{wordData.example}</em></p>}

                </div>
            
            </div>
        </div>
    );
};