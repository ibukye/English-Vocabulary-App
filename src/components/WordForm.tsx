

import './WordForm.css';


type WordFormProps = {
    word: string;
    meaning: string;
    example: string;
    setWord: (value: string) => void;
    setMeaning: (value: string) => void;
    setExample: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    buttonText: string;
    tags: string;
    setTags: (value: string) => void;
};

export default function WordForm({
    word, meaning, example, setWord, setMeaning, setExample, handleSubmit, buttonText, tags, setTags
}: WordFormProps) {
    return (
        <form 
            onSubmit={handleSubmit}
            className='max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6 transition-all duration-300'
        >
            <h2 className='text-2xl font-semibold text-gray-800 text-center'>
                単語を登録
            </h2>
            
            <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>
                    単語:
                </label>
                <input type="text" value={word} onChange={(e) => setWord(e.target.value)} required className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-black"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">意味:</label>
                <input type="text" value={meaning} onChange={(e) => setMeaning(e.target.value)} required className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-black"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">例文:</label>
                <input type="text" value={example} onChange={(e) => setExample(e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-black"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">タグ (カンマ区切り):</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="例: 中学2年中間, 2025" className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-black"/>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 active:scale-[0.98] transition-all ">{buttonText}</button>
        </form>
    );
}