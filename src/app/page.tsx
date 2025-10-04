'use client';


import Link from "next/link";
import StudyPage from "./study/page";
import MenuButton from "@/components/ui/MenuButton";
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const querySnapshot = await getDocs(collection(db, "words"));
      // 全単語tag配列を一つの大きな配列にまとめる
      const allTags = querySnapshot.docs.flatMap(doc => doc.data().tags || []);
      // 重複をなくしてuniqueに
      const uniqueTags = [...new Set(allTags)];
      setTags(uniqueTags);
    };
    fetchTags();
  }, []);


  
  return (
    <div className="menu-container">
      
      <h1>英単語学習帳</h1>
      
      <MenuButton href="/add-word" label="新しい単語を追加する" />
      
  
      <p>学習モードを選択してください</p>

      {/* 常に全単語ボタンを表示 */}
      <div className="menu-buttons">
        <div>
          <h3>全ての単語</h3>
          <MenuButton href="/study?mode=en-jp" label="英語 → 日本語" />
          <MenuButton href="/study?mode=jp-en" label="日本語 → 英語" />
        </div>


        {/* tagごとの学習ボタンを動的に生成 */}
        {tags.length > 0 && (
          <>
            <h2>tag別に学習</h2>
            {tags.map(tag => (
              <div key={tag}>
                <h3>{tag}</h3>
                <MenuButton href={`/study?mode=en-jp&tag=${tag}`} label="英語 → 日本語" />
                <MenuButton href={`/study?mode=jp-en&tag=${tag}`} label="日本語 → 英語" />
              </div>
            ))}
          </>
        )}



        
      </div>
    </div>
  );
}
