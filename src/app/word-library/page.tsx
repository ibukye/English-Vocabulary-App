"use client";

import { useEffect, useState } from "react";

// Firebase Firestoreから関数とdbをimport
import { collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MenuButton from "@/components/ui/MenuButton";
//import Flashcard from "@/components/feature/Flashcard";
import LibraryCard from "@/components/feature/LibraryCard";
import WordForm from "@/components/WordForm";
import Link from "next/link";


type Word = {
    id: string;
    word: string;
    meaning: string;
    example?: string;
    memo?: string;
    mistakeCount: number;
    lastCorrectDate: Date | null;
    tags?: string[];
    createdAt: Date | null;
};

type SortType = 'createdAt' | 'mistakeCount';
type SortOrderType = 'asc' | 'desc';

/*
単語カードを一覧にして表示するページ
ソート (日付、間違えた数の多い順、)　昇順/降順
検索 (word, meaning, note)
tag検索
単語カードの編集、削除
*/
export default function LibraryPage() {
    const [allWords, setAllWords] = useState<Word[]>([]);
    const [filteredWords, setFilteredWords] = useState<Word[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchWord, setSearchWord] = useState('');
    // sort 
    const [sortBy, setSortBy] = useState<SortType>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrderType>('asc');
    // edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWord, setEditingWord] = useState<Word | null>(null);

    // Firestoreから全単語を取得するuseEffect
    useEffect(() => {
        const fetchInitialData = async () => {
            const q = query(collection(db, "words"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(q);
            const wordsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                lastCorrectDate: doc.data().lastCorrectDate?.toDate() || null,
                createdAt: doc.data().createdAt?.toDate() || null,
            })) as Word[];
            
            setAllWords(wordsData);

            // tagの取得
            const allTags = wordsData.flatMap(word => word.tags || []);
            const uniqueTags = [...new Set(allTags as string[])];
            setAvailableTags(uniqueTags);

            setIsLoading(false);
        };
        fetchInitialData();
    }, []);

    

    // 絞り込み&sort
    useEffect(() => {
        let tempWords = [...allWords];
        // tag
        if (selectedTag) {
            tempWords = tempWords.filter(word => 
                word.tags?.includes(selectedTag)
            );
        }
        // search
        if (searchWord) {
            const lowercasedFilter = searchWord.toLowerCase();
            tempWords = tempWords.filter(word => {
                return word.word.toLowerCase().includes(lowercasedFilter) || word.meaning.toLowerCase().includes(lowercasedFilter);
            });
        }
        // sort
        tempWords.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            // 日付や数値のnull/undefinedを適切に扱う
            const valA = aVal instanceof Date ? aVal.getTime() : (typeof aVal === 'number' ? aVal : 0);
            const valB = bVal instanceof Date ? bVal.getTime() : (typeof bVal === 'number' ? bVal : 0);

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredWords(tempWords);
   
    }, [searchWord, selectedTag, sortBy, sortOrder, allWords]);


    // deletion
    const handleDelete = async (id: string) => {
        if (!window.confirm("この単語を削除しますか？")) return;
        try {
            await deleteDoc(doc(db, "words", id));
            setAllWords(prev => prev.filter(word => word.id !== id));
            alert("単語を削除しました");
        } catch (error) {
            console.error("削除エラー:", error);
            alert("削除に失敗しました");
        }
    };

    const handleOpenEditModal = (word: Word) => {
        setEditingWord(word);
        setIsEditModalOpen(true);
    };

    const handleUpdateWord = async (updatedData: Partial<Word>) => {
        if (!editingWord) return;
        try {
            const wordRef = doc(db, "words", editingWord.id);
            await updateDoc(wordRef, updatedData);

            setAllWords(prev => prev.map(word =>
                word.id === editingWord.id ? {...word, ...updatedData } : word
            ));
            setIsEditModalOpen(false);
            setEditingWord(null);
            alert("更新しました");
        } catch (error) {
            console.error("更新エラー:", error);
            alert("更新に失敗しました");
        }
    }


    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
            データを読み込んでいます...
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="max-w-10xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="m-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">メニュー画面に戻る</Link>
                    <h1 className="text-3xl font-bold text-gray-900">📘 単語帳ライブラリ</h1>
                    <MenuButton href="/" label="メニューに戻る" />
                </div>

                {/* 検索とソート */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white shadow-sm rounded-xl p-4">
                    <input
                        type="text"
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        placeholder="🔍 単語や意味で検索..."
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortType)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="createdAt">登録日</option>
                            <option value="mistakeCount">間違えた回数</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="asc">昇順</option>
                            <option value="desc">降順</option>
                        </select>
                    </div>
                </div>

                {/* タグフィルタ */}
                {availableTags.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3 text-gray-700">タグで絞り込み</h2>
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                            <button
                            key={tag}
                            onClick={() =>
                                setSelectedTag(selectedTag === tag ? null : tag)
                            }
                            className={`px-4 py-2 rounded-full border transition-all ${
                                selectedTag === tag
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                            }`}
                            >
                            {tag}
                            </button>
                        ))}
                        {selectedTag && (
                            <button
                            onClick={() => setSelectedTag(null)}
                            className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                            クリア
                            </button>
                        )}
                    </div>
                </div>
                )}

                {/* 単語カード一覧 */}
                {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">*/}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 p-6">
                    {filteredWords.length > 0 ? (
                        filteredWords.map((word) => (
                        <LibraryCard 
                            key={word.id} 
                            wordData={word} 
                            onEdit={handleOpenEditModal}
                            onDelete={handleDelete}
                        />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">
                        該当する単語が見つかりません。
                        </div>
                    )}
                </div>
            </div>

            {/* 編集モーダル */}
            {isEditModalOpen && editingWord && (
                <EditModal 
                    word={editingWord}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateWord}
                />
            )}

        </div>
    );
}



// 編集モーダルコンポーネント
function EditModal({ word, onClose, onSave }: { word: Word, onClose: () => void, onSave: (data: Partial<Word>) => void }) {
    // フォームの各入力値をstateで管理 (命名を統一)
    const [wordState, setWordState] = useState(word.word);
    const [meaningState, setMeaningState] = useState(word.meaning);
    const [exampleState, setExampleState] = useState(word.example || '');
    // tagsは文字列として扱い、配列を .join(', ') で文字列に変換
    const [tagsState, setTagsState] = useState((word.tags || []).join(', '));
    const [memoState, setMemoState] = useState(word.memo || '');

    // 保存ボタンが押されたときの処理
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // タグの文字列を配列に戻す
        const tagsArray = tagsState.split(',').map(tag => tag.trim()).filter(tag => tag);

        // 親コンポーネントに更新データを渡す
        onSave({
            word: wordState,
            meaning: meaningState,
            example: exampleState,
            tags: tagsArray,
            memo: memoState,
        });
    };

    return (
        // 背景を暗くするオーバーレイ
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">単語を編集</h2>
                
                {/* WordFormは<form>要素そのものなので、<form>でラップしない */}
                <WordForm
                    word={wordState}
                    meaning={meaningState}
                    example={exampleState}
                    tags={tagsState}
                    memo={memoState}
                    setWord={setWordState}
                    setMeaning={setMeaningState}
                    setExample={setExampleState}
                    setTags={setTagsState}
                    setMemo={setMemoState}
                    handleSubmit={handleSave} // ★ 保存処理を渡す
                    buttonText="変更を保存"
                    // refはAddWordPageでしか使わないのでここでは不要
                />

                <div className="flex justify-end gap-4 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                        キャンセル
                    </button>
                    {/* 保存ボタンはWordForm内に統一したので不要 */}
                </div>
            </div>
        </div>
    );
}