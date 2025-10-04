'use client';

// Firestore関連の関数とdb instanceをimport
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import WordForm from '@/components/WordForm';
import MenuButton from '@/components/ui/MenuButton';


export default function AddWordPage() {
    
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [example, setExample] = useState('');
    const [tags, setTags] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();     // formのdefault送信動作を防ぐ

        if (!word || !meaning) {
            alert("単語と意味は必須です");
            return;
        }

        // 入力されたタグ文字列を配列に変換
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        try {
            // word collectionに新しいドキュメントを追加
            const docRef = await addDoc(collection(db, 'words'), {
                word: word,
                meaning: meaning,
                example: example,
                mistakeCount: 0,
                lastCorrectDate: null,
                tags: tagsArray,
            });

            console.log('Document written with ID: ', docRef.id);
            alert("単語を登録しました");

            // 登録後にformをclear
            setWord('');
            setMeaning('');
            setExample('');
            setTags('');
        } catch (error) {
            console.log('Error adding document: ', error);
            alert('登録に失敗しました');
        }
    };

    return (
        <div>
            <h1>単語登録ページ</h1>
            <MenuButton href="/" label="メニュー画面に戻る" />
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
            />
        </div>



    );
}