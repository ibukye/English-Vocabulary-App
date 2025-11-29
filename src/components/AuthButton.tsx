'use client';

import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, signOut, getRedirectResult } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AuthButton() {
  const { user, isLoading } = useAuth();
  const [debugLog, setDebugLog] = useState<string[]>([]); // 画面表示用のログ

  // ログを追加する関数
  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()} : ${msg}`]);
  };

  useEffect(() => {
    addLog("画面ロード完了: リダイレクト結果を確認します...");
    
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          addLog(`★成功: ユーザー ${result.user.email} を取得しました`);
        } else {
          addLog("結果: リダイレクトからの戻りではありませんでした（または情報がありません）");
        }
      })
      .catch((error) => {
        addLog(`★エラー発生: ${error.code} - ${error.message}`);
      });
  }, []);

  const handleLogin = async () => {
    addLog("ログインボタンが押されました");
    try {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addLog("LocalHost環境: Popup開始");
        await signInWithPopup(auth, provider);
      } else {
        addLog("本番環境: Redirect開始 (画面が切り替わります)");
        await signInWithRedirect(auth, provider);
      }
    } catch (error: any) {
      addLog(`ログイン開始失敗: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      addLog("ログアウトしました");
    } catch (error: any) {
      addLog(`ログアウト失敗: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 text-sm">確認中...</div>;
  }

  return (
    <div className="mb-4 flex flex-col items-center">
      {/* === 診断ログ表示エリア (デバッグ用) === */}
      <div className="w-full max-w-sm bg-black text-green-400 p-2 text-xs font-mono mb-4 rounded text-left overflow-y-auto max-h-40 border border-gray-500">
        <p className="border-b border-gray-600 mb-1">--- 診断ログ ---</p>
        {debugLog.length === 0 ? <p>待機中...</p> : debugLog.map((log, i) => <p key={i}>{log}</p>)}
      </div>
      {/* ==================================== */}

      {user ? (
        <div className="flex flex-col items-center gap-3">
          {user.photoURL ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={user.photoURL} 
              alt="User Icon" 
              className="w-16 h-16 rounded-full border-2 border-indigo-100 shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300">User</div>
          )}
          <button onClick={handleLogout} className="px-4 py-2 text-sm bg-gray-100 rounded-full">ログアウト</button>
        </div>
      ) : (
        <button 
          onClick={handleLogin} 
          className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full shadow-md border border-gray-200 flex items-center gap-3"
        >
          {/* Google Logo */}
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