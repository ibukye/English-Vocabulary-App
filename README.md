# My Vocabulary App - オリジナル英単語学習帳



自分だけのオリジナル単語帳を作成して、効率的に英単語を学習するためのWebアプリケーションです。フラッシュカード形式での学習や、苦手な単語の管理機能などを通じて、記憶の定着をサポートします。

**デモサイトURL:** `https://<あなたのアプリのURL>.vercel.app/`

---

## ✨ 主な機能

- **フラッシュカード学習**:
  - 「英語→日本語」「日本語→英語」の双方向学習モード
  - ネイティブ音声の再生機能
- **単語ライブラリ**:
  - 登録した単語の一覧表示
  - 単語や意味でのリアルタイム検索機能
  - 登録日や間違い回数でのソート機能
- **単語管理**:
  - 新規単語の登録（例文、メモ、タグ付けに対応）
  - 登録済み単語の編集・削除機能
- **進捗トラッキング**:
  - 間違えた回数や最終正解日を記録
- **タグ（単語セット）機能**:
  - 単語をタグで分類し、特定のセットだけを学習可能

---

## 🚀 技術スタック

このプロジェクトで使用している主な技術です。

| カテゴリ       | 技術                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **フロントエンド** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **UI** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)                             |
| **バックエンド** | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)                                       |
| **デプロイ** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                                               |

---

## 🛠️ ローカルでの環境構築

このプロジェクトを自分のPCで動かすための手順です。

1.  **リポジトリをクローン**
    ```bash
    git clone [https://github.com/](https://github.com/)<あなたのGitHubユーザー名>/<リポジトリ名>.git
    cd <リポジトリ名>
    ```

2.  **依存関係をインストール**
    ```bash
    npm install
    ```

3.  **環境変数の設定**
    プロジェクトのルートに`.env.local`という名前のファイルを作成し、以下の内容を参考に自分のFirebaseプロジェクトの情報を入力してください。

    ```.env.local
    # Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY=<あなたのAPIキー>
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<あなたのAuthドメイン>
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=<あなたのプロジェクトID>
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<あなたのStorageバケット>
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<あなたのSender ID>
    NEXT_PUBLIC_FIREBASE_APP_ID=<あなたのApp ID>
    ```

4.  **開発サーバーを起動**
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:3000` を開くと、アプリケーションが表示されます。

---

## 🔥 Firebaseのセットアップ

このアプリはバックエンドにFirebase (Firestore) を使用しています。

- **コレクション名**: `words`
- **セキュリティルール**: 開発中はテストモードで開始し、本番環境では認証情報に基づいて適切なルールを設定してください。
- **インデックス**: `where`句と`orderBy`句を組み合わせたクエリ（タグでの絞り込みと日付でのソートなど）を実行すると、Firebaseコンソールに複合インデックスの作成を促すエラーが表示されることがあります。その際はエラーメッセージ内のリンクをクリックしてインデックスを作成してください。

---

## 📝 今後の展望 (Future Improvements)

- [ ] ユーザー認証機能の実装（Google, Emailなど）
- [ ] 忘却曲線に基づいた復習最適化アルゴリズム（SRS）の導入
- [ ] 学習状況を可視化するダッシュボード機能
- [ ] 単語リストのCSVインポート/エクスポート機能

---

## 📄 ライセンス

このプロジェクトはMITライセンスです。