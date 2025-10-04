"use client";

import MenuButton from "@/components/ui/MenuButton";
import Flashcard from "@/components/feature/Flashcard";
import { useEffect, useState, Suspense } from "react";
// URLのパラメータを読み込むためにuseSearchParamsをインポート
import { useSearchParams } from 'next/navigation';


// Firebase Firestoreから関数とdbをimport
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


// 学習モードの型
type StudyMode = 'en-jp' | 'jp-en';

type Word = {
    id: string;
    word: string;
    meaning: string;
    example?: string;
    mistakeCount: number;
    lastCorrectDate: Date | null;
}

function StudyPageContent() {
    const [words, setWords] = useState<Word[]>([]);     // 単語リスト全体のstate
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // URLからquery parameterを読み取る
    const searchParams = useSearchParams();
    // 'mode' parameterを取得、存在しない場合は'en-jp'をdefaultに
    const initialMode = (searchParams.get('mode') as StudyMode) || 'en-jp';
    // 取得したmodeを初期値として設定
    const [mode, setMode] = useState(initialMode);

    const [isFlipped, setIsFlipped] = useState(false);

    // ページ読み込み時にFirestoreから単語データを取得
    useEffect(() => {
        const fetchWords = async () => {
            const querySnapshot = await getDocs(collection(db, "words"));   // wordsコレクションから全件取得
            const wordsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // FirestoreのTimestamp型をJavaScriptのDate型に変換
                lastCorrectDate: doc.data().lastCorrectDate?.toDate() || null,
            })) as Word[];

            setWords(wordsData);
            setIsLoading(false);
        };
        fetchWords();
    }, []); // 初回レンダリング時のみ

    {/*
    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'en-jp' ? 'jp-en' : 'en-jp'));
        //setIsFlipped(false);    // モード切替時にカードを表に戻す
    }*/}

    const handleAnswer = async (isCorrect: boolean) => {
        const currentWord = words[currentIndex];
        if (!currentWord) return;

        const wordRef = doc(db, "words", currentWord.id);   // 更新対象のドキュメントへの参照

        const updatedWordData: Partial<Word> = {};
        if (isCorrect) {
            await updateDoc(wordRef, {lastCorrectDate: new Date(), });
        } else {
            await updateDoc(wordRef, {mistakeCount: currentWord.mistakeCount+1, });
        }
        
        await updateDoc(wordRef, updatedWordData);

        const newWords = words.map((word) => 
            word.id === currentWord.id ? { ...word, ...updatedWordData } : word
        );
        setWords(newWords);

        goToNextWord();
    };

    const goToNextWord = () => {
        setIsFlipped(false);
        // 最後の単語でなければindex++
        if (currentIndex < words.length-1) {
            setCurrentIndex(currentIndex+1);
        } else {
            alert("学習完了!");
        }
    };

    // Loading Screen
    if (isLoading) return <div>Loading...</div>;
    // No words in the db
    if (words.length===0) return <div>単語が登録されていません</div>;

    const currentWord = words[currentIndex];

    return (
        <div className="study-page">
            <h1>学習ページ</h1>

            <MenuButton href="/" label="メニュー画面に戻る"/>

            <p>現在のモード: {mode=== 'en-jp' ? '英語 日本語' : '日本語 英語'}</p>
           
            <Flashcard 
                key={currentWord.id}
                wordData={currentWord}  
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(prev => !prev)} 
                mode={mode}
            />

            {/* 正解、不正解ボタンを配置 */}
            <div className="answer-buttons" style={{ marginTop: '20px' }}>
                <button onClick={() => handleAnswer(false)} className="bg-blue-500 px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transision duration-300 text-center" style={{ marginRight: '10px', backgroundColor: '' }}> うーん </button>
                <button onClick={() => handleAnswer(true)} className="bg-blue-500 px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transision duration-300 text-center" style={{ marginRight: '10px' }}> わかった </button>

            </div>




        </div>
    );
};





// ページのエントリーポイントとなる新しいコンポーネントを定義
export default function StudyPage() {
    return (
        // 3. SuspenseでStudyPageContentをラップする
        <Suspense fallback={<div>Loading Page...</div>}>
            <StudyPageContent />
        </Suspense>
    );
}
