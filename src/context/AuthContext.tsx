'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase'; // firebase.tsでappもexportするように変更が必要

// 認証インスタンスを取得
const auth = getAuth(app);

// Contextで共有する値の型を定義
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

// アプリ全体をラップするためのProviderコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChangedで認証状態の変更を監視する
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 認証状態変更:", user ? `ログイン中: ${user.email}` : "未ログイン");
      console.log("👤 ユーザー情報:", user);
      setUser(user);
      setIsLoading(false);
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 他のコンポーネントから簡単にuser情報を取得するためのカスタムフック
export const useAuth = () => useContext(AuthContext);