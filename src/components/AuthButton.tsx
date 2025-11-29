'use client';

// Redirect機能とPopup機能の両方をインポート
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, signOut, getRedirectResult } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AuthButton() {
  const { user, isLoading } = useAuth();
  // 画像の読み込みエラーを管理するステート
  const [imageError, setImageError] = useState(false);

  // コンポーネントが表示された時に、リダイレクトから戻ってきたかチェックする
  useEffect(() => {
    console.log("🔄 リダイレクト結果を確認中...");
    console.log("現在のURL:", window.location.href);
    
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("✅✅✅ リダイレクトログイン成功!!");
          console.log("ユーザー情報:", result.user);
          console.log("メールアドレス:", result.user.email);
        } else {
          console.log("ℹ️ リダイレクト結果なし（通常のページ読み込み）");
        }
      })
      .catch((error) => {
        console.error("❌❌❌ リダイレクトエラー!!");
        console.error("エラー全体:", error);
        console.error("エラーコード:", error.code);
        console.error("エラーメッセージ:", error.message);
        
        if (error.code !== 'auth/popup-closed-by-user') {
          alert(`ログイン失敗: ${error.code} - ${error.message}`);
        }
      });
  }, []);

  // ユーザーが変わったら画像エラー状態をリセット
  useEffect(() => {
    setImageError(false);
  }, [user]);

  // ログイン処理
  const handleLogin = async () => {
    console.log("🔵 ログインボタンがクリックされました");
    console.log("🌐 現在のホスト名:", window.location.hostname);
    
    try {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log("💻 LocalHost環境: Popupでログイン");
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Popupログイン成功:", result.user.email);
      } else {
        console.log("🌍 本番環境: Redirectでログイン");
        await signInWithRedirect(auth, provider);
        console.log("🔄 リダイレクト開始...");
      }
    } catch (error: any) {
      console.error("❌ ログイン開始エラー:", error);
      console.error("エラーコード:", error.code);
      console.error("エラーメッセージ:", error.message);
      
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert(`ログイン開始エラー: ${error.message}`);
      }
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ログアウトしました");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("ログアウトエラー:", error);
      alert(`ログアウトエラー: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 text-sm">確認中...</div>;
  }

  return (
    <div className="mb-4">
      {user ? (
        <div className="flex flex-col items-center gap-3">
          {/* 画像表示エリア: エラーがなく、URLがある場合のみ画像を表示 */}
          {!imageError && user.photoURL ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={user.photoURL} 
              alt="User Icon" 
              className="w-16 h-16 rounded-full border-2 border-indigo-100 shadow-sm object-cover"
              // 重要: これがないとGoogleの画像が表示されないことがあります
              referrerPolicy="no-referrer"
              // 読み込みに失敗したらエラー状態にする（引数の e を削除）
              onError={() => {
                console.error("画像読み込みエラー");
                setImageError(true);
              }}
            />
          ) : (
            // 画像がない、または読み込み失敗時のデフォルトアイコン
            <div className="w-16 h-16 rounded-full border-2 border-indigo-100 shadow-sm bg-indigo-50 flex items-center justify-center text-indigo-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
                ログアウト
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleLogin} 
          className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all flex items-center gap-3"
        >
          {/* Google Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Googleでログイン
        </button>
      )}
    </div>
  );
}