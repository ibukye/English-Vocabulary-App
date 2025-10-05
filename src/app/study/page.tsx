"use client";

import MenuButton from "@/components/ui/MenuButton";
import Flashcard from "@/components/feature/Flashcard";
import { useEffect, useState, Suspense } from "react";
// URLのパラメータを読み込むためにuseSearchParamsをインポート
import { useSearchParams } from 'next/navigation';


// Firebase Firestoreから関数とdbをimport
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from "firebase/firestore";
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
    const [words, setWords] = useState<Word[]>([]);     // 単語リスト全体のstates
    const [availableTags, setAvailableTags] = useState<string[]>([]);   //選択可能なtagのlist
    const [selectedTag, setSelectedTag] = useState<string | null>(null);    // userが選択したtag

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // URLからquery parameterを読み取る
    const searchParams = useSearchParams();
    // 'mode' parameterを取得、存在しない場合は'en-jp'をdefaultに
    const initialMode = (searchParams.get('mode') as StudyMode) || 'en-jp';
    

    // 取得したmodeを初期値として設定
    const [mode, setMode] = useState(initialMode);

    const [isFlipped, setIsFlipped] = useState(false);


    // tagを取得するためのuseEffect
    useEffect(() => {
        const fetchTags = async () => {
            const querySnapshot = await getDocs(collection(db, "words"));
            const allTags = querySnapshot.docs.flatMap(doc => doc.data().tags || []);
            const uniqueTags = [...new Set(allTags)];
            setAvailableTags(uniqueTags);
            setIsLoading(false); // タグの読み込みが終わったらローディング終了
        };
        fetchTags();
    }, []);

    // 単語を取得するためのuseEffect
    useEffect(() => {
        if (!selectedTag) return;

        setIsLoading(true);
        const fetchWords = async () => {
            const wordsCollectionRef = collection(db, "words");
            // allの場合は全件
            const q = selectedTag === 'all' ? query(wordsCollectionRef, orderBy("createdAt", "asc")) : query(wordsCollectionRef, where("tags", "array-contains", selectedTag), orderBy("createdAt", "asc"));
            
            const querySnapshot = await getDocs(q);   // wordsコレクションからtag分

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
    }, [selectedTag]); // selectedTagを依存配列に追加 -> selectedTagが変更されたときに実行される

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

    // tag selection screen
    if (!selectedTag) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">学習する単語セットを選択</h1>
                    <div className="mb-8">
                        <MenuButton href="/" label="メニューに戻る" />
                    </div>
                    {isLoading ? (
                        <div>Loading tags...</div>
                    ) : (
                        <div className="space-y-6">
                            {/* すべての単語を選択するボタン */}
                            <div>
                                <button 
                                    onClick={() => setSelectedTag('all')}
                                    className="w-full md:w-auto bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                                >
                                    すべての単語、熟語
                                </button>
                            </div>
                            {/* tagごとのボタン */}
                            {availableTags.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-600 mb-4">タグから選ぶ</h2>
                                    {/* タグボタンを横に並べ、画面幅で折り返すためのコンテナ */}
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {availableTags.map(tag => (
                                            <button 
                                                key={tag} 
                                                onClick={() => setSelectedTag(tag)}
                                                className="bg-white text-gray-700 font-semibold py-2 px-5 border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Loading Screen
    if (isLoading) return <div>Loading...</div>;
    // No words in the db
    if (words.length===0) return <div>単語が登録されていません</div>;

    const currentWord = words[currentIndex];

    return (
        <div className="study-page">
            <h1>学習ページ</h1>

            <MenuButton href="/" label="メニュー画面に戻る"/>
            <button onClick={() => setSelectedTag(null)}>セット選択に戻る</button>

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
