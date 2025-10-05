'use client';

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext'; // 作成したuseAuthフックを使用

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AuthButton() {
  const { user, isLoading } = useAuth();

  // Googleログイン処理
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (isLoading) {
    return <div>...</div>; // ローディング表示
  }

  return (
    <div>
      {user ? (
        // ログインしている場合
        <div className="fixed top-0 right-0 m-4 bg-blue-500 text-white p-2 rounded-2xl flex items-center gap-4">
          <img src={user.photoURL || ''} alt="User avatar" className="w-8 h-8 rounded-full" />
          <span>{user.displayName}</span>
          <button onClick={handleLogout} className="px-4 py-2 rounded-2xl bg-gray-500 hover:bg-gray-300">
            ログアウト
          </button>
        </div>
      ) : (
        // ログインしていない場合
        <button onClick={handleLogin} className="fixed top-0 right-0 m-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
          Googleでログイン
        </button>
      )}
    </div>
  );
}