'use client';

import MenuButton from "@/components/ui/MenuButton";
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AuthButton from "@/components/AuthButton";

export default function Home() {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const querySnapshot = await getDocs(collection(db, "words"));
      const allTags = querySnapshot.docs.flatMap(doc => doc.data().tags || []);
      const uniqueTags = [...new Set(allTags)];
      setTags(uniqueTags);
    };
    fetchTags();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-10 text-center border border-gray-100">
        <AuthButton />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          英単語学習帳
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <MenuButton href="/add-word" label="新しい単語を追加する" />
          <MenuButton href="/word-library" label="単語帳一覧" />
        </div>
    
        <div className="mt-8">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              学習モードを選択してください
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MenuButton href="/study?mode=en-jp" label="英語 → 日本語" />
              <MenuButton href="/study?mode=jp-en" label="日本語 → 英語" />
            </div>

        </div>

      </div>
    </div>
  );
}
