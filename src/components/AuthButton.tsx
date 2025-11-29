'use client';

// 1. signInWithRedirect をインポートに追加
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AuthButton() {
  const { user, isLoading } = useAuth();

  // Googleログイン処理
  const handleLogin = async () => {
    try {
      // 2. ここを signInWithRedirect に変更
      // 注意: リダイレクトするため、この行の下のコードは即時には実行されません
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (isLoading) {
    return <div>...</div>;
  }

  return (
    <div>
      {user ? (
        <div className="fixed top-0 right-0 m-4 bg-blue-500 text-white p-2 rounded-2xl flex items-center gap-4">
          {/* 安全のため photoURL があるかチェック */}
          {user.photoURL && (
            <img src={user.photoURL} alt="User avatar" className="w-8 h-8 rounded-full" />
          )}
          <span>{user.displayName}</span>
          <button onClick={handleLogout} className="px-4 py-2 rounded-2xl bg-gray-500 hover:bg-gray-300">
            ログアウト
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="fixed top-0 right-0 m-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
          Googleでログイン
        </button>
      )}
    </div>
  );
}