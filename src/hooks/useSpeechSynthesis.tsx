'use client';

import { useState, useEffect } from 'react';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    // ブラウザが音声リストを読み込んだら`voices` stateを更新
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    // 初期読み込み
    handleVoicesChanged(); 

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  const speak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // 英語の音声を選択 (Google US Englishが利用可能なら優先)
    const englishVoice = voices.find(voice => voice.name === 'Google US English') || voices.find(voice => voice.lang.startsWith('en-'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return { speak, isSpeaking };
}