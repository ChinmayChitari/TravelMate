import { useState, useEffect } from 'react';

const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    // In a real app, integrate Web Speech API
    console.log("Listening...");
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return { isListening, transcript, startListening, stopListening };
};

export default useSpeech;
