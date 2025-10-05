import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';




// Flashcardが受け取るデータの型
type WordData = {
    id: string;     // edit,deleteのために必要
    word: string;
    meaning: string;
    example?: string;
    memo?: string;
    mistakeCount: number;
    lastCorrectDate: Date | null;
    tags?: string[];
    createdAt: Date | null;
};

type LibraryCardProps = {
    wordData: WordData;
    onEdit: (word: WordData) => void;   // edit buttonが押されたときに呼ばれるfunction
    onDelete: (id: string) => void;     // delete buttonが押されたときに呼ばれるfunction
}



export default function LibraryCard({ wordData, onEdit, onDelete }: LibraryCardProps) {
    return (
        <div className="relative w-full h-full max-w-md mx-auto my-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
            {/* edit, delete button container */}
            <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => onEdit(wordData)} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition">
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(wordData.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
            
            {/* 主要なコンテンツをまとめるdiv */}
            <div className="flex-grow">
                {/* 単語 */}
                <h2 className="text-2xl font-bold text-indigo-600">{wordData.word}</h2>

                {/* 意味 */}
                <h3 className="text-lg font-medium text-gray-700 mt-1">{wordData.meaning}</h3>

                {/* 例文 */}
                {wordData.example && (
                    <p className="italic text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border-l-4 border-indigo-300 mt-3">
                        {wordData.example}
                    </p>
                )}

                {/* メモ */}
                {wordData.memo && (
                    <p className="text-sm text-gray-700 bg-yellow-50 px-3 py-2 rounded-md border-l-4 border-yellow-300 mt-3">
                        💡 {wordData.memo}
                    </p>
                )}
            </div>

            {/* 統計情報をまとめるdiv */}
            {/* 2. mt-autoを追加して、このブロックをカードの最下部に押しやる */}
            <div className="mt-auto pt-4">
                {/* 間違えた回数 */}
                {wordData.mistakeCount > 0 && <p className="text-sm font-semibold text-red-500">
                    ❌ 間違えた回数: {wordData.mistakeCount}
                </p>}

                {/* 最終正解日 */}
                {wordData.lastCorrectDate && (
                    <p className="text-xs text-gray-500 mt-1">
                        ✅ 最終正解日:{" "}
                        {new Date(wordData.lastCorrectDate).toLocaleDateString("ja-JP")}
                    </p>
                )}
            </div>
        </div>
  );
}