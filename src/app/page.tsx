'use client';

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

      <div className="menu-buttons">
          <MenuButton href="/study?mode=en-jp" label="英語 → 日本語" />
          <MenuButton href="/study?mode=jp-en" label="日本語 → 英語" />
      </div>
    </div>
  );
}
