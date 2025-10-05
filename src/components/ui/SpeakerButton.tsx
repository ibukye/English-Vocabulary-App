'use client';

import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
// アイコンをインストール: npm install @heroicons/react
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'; 

type SpeakerButtonProps = {
  textToSpeak: string;
};

export default function SpeakerButton({ textToSpeak }: SpeakerButtonProps) {
  const { speak, isSpeaking } = useSpeechSynthesis();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを抑制
    speak(textToSpeak);
  };

  return (
    <button 
      onClick={handleSpeak}
      // isSpeaking中はアニメーションを追加
      className={`p-2 rounded-full transition ${isSpeaking ? 'bg-blue-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
      aria-label="音声再生"
    >
      <SpeakerWaveIcon className={`h-6 w-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
    </button>
  );
}