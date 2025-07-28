import { ref } from 'vue';

export function useAudio() {
  const isSupported = ref('speechSynthesis' in window);
  const isSpeaking = ref(false);

  const speak = (text: string, lang: string = 'id-ID') => {
    if (!isSupported.value) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      isSpeaking.value = true;
    };

    utterance.onend = () => {
      isSpeaking.value = false;
    };

    utterance.onerror = () => {
      isSpeaking.value = false;
    };

    speechSynthesis.speak(utterance);
  };

  const announceQueue = (queueNumber: string, staffName?: string) => {
    const announcement = staffName 
      ? `Nomor antrian ${queueNumber} silakan menuju ke ${staffName}`
      : `Nomor antrian ${queueNumber} dipanggil`;
    
    speak(announcement);
  };

  const stop = () => {
    speechSynthesis.cancel();
    isSpeaking.value = false;
  };

  return {
    isSupported,
    isSpeaking,
    speak,
    announceQueue,
    stop,
  };
}
