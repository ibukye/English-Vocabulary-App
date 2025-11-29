'use client';

// Firestore関連の関数とdb instanceをimport
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import WordForm from '@/components/WordForm';
import MenuButton from '@/components/ui/MenuButton';


export default function AddWordPage() {

    // ここでログイン情報を取得
    const { user } = useAuth();
    
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [example, setExample] = useState('');
    const [tags, setTags] = useState('');
    const [memo, setMemo] = useState('');

    // inputのためのRefを作成
    const wordInputRef = useRef<HTMLInputElement>(null);
    // ページが読み込まれたときにfocusする
    useEffect(() => {
        wordInputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();     // formのdefault送信動作を防ぐ

        // 1. ログインチェック：userが空なら処理を止める
        if (!user) {
            alert("エラー: ログインしていません。ログインしてから登録してください。");
            return;
        }

        if (!word || !meaning) {
            alert("単語と意味は必須です");
            return;
        }

        // 入力されたタグ文字列を配列に変換
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        try {
            // word collectionに新しいドキュメントを追加
            await addDoc(collection(db, 'words'), {
                word: word,
                meaning: meaning,
                example: example,
                mistakeCount: 0,
                lastCorrectDate: null,
                tags: tagsArray,
                memo: memo,
                createdAt: serverTimestamp(),
                // 誰が登録したか分かるようにIDも保存しておく（推奨）
                userId: user.uid, 
            });

            alert("単語を登録しました");

            // 登録後にformをclear
            setWord('');
            setMeaning('');
            setExample('');
            setTags('');
            setMemo('');
            wordInputRef.current?.focus();
        } catch (error) {
            console.log('Error adding document: ', error);
            alert('登録に失敗しました');
        }
    };

    return (
        <div>
            <h1>単語登録ページ</h1>
            <MenuButton href="/" label="メニュー画面に戻る" />

            {/* ログインしていない時に警告を出すUI（オプション） */}
            {!user && (
                <p style={{color: 'red', fontWeight: 'bold', padding: '10px'}}>
                    ※現在ログインしていません。登録するにはログインが必要です。
                </p>
            )}

            
            <WordForm 
                word={word}
                meaning={meaning}
                example={example}
                setWord={setWord}
                setMeaning={setMeaning}
                setExample={setExample}
                handleSubmit={handleSubmit}
                buttonText="登録する"
                tags={tags}
                setTags={setTags}
                memo={memo}
                setMemo={setMemo}
                ref={wordInputRef}
            />
        </div>



    );
}