import { useCallback, useEffect, useRef, useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import RSVPDisplay from './components/RSVPDisplay.jsx';
import Controls from './components/Controls.jsx';
import { tokenize, getPauseMultiplier } from './utils/tokenizer.js';
import './App.css';

const msPerWord = (wpm) => 60000 / wpm;

export default function App() {
  const [words, setWords] = useState([]);
  const [sourceName, setSourceName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(350);
  const timeoutRef = useRef(null);

  const hasText = words.length > 0;
  const isFinished = hasText && currentIndex >= words.length;

  const handleSeek = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleTextReady = useCallback((text, name) => {
    const tokens = tokenize(text);
    setWords(tokens);
    setSourceName(name);
    setCurrentIndex(0);
    setIsPlaying(tokens.length > 0);
  }, []);

  const handleNewText = useCallback(() => {
    setIsPlaying(false);
    setWords([]);
    setSourceName('');
    setCurrentIndex(0);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((playing) => {
      if (isFinished) {
        setCurrentIndex(0);
        return true;
      }
      return !playing;
    });
  }, [isFinished]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  const handleJumpBack = useCallback((amount) => {
    setCurrentIndex((i) => Math.max(0, i - amount));
    setIsPlaying(true);
  }, []);

  // Advance through the word list while playing, pacing each word by
  // wpm and giving sentence/comma endings a slightly longer beat.
  useEffect(() => {
    if (!isPlaying || !hasText) return undefined;
    if (currentIndex >= words.length) {
      setIsPlaying(false);
      return undefined;
    }

    const word = words[currentIndex];
    const delay = msPerWord(wpm) * getPauseMultiplier(word);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying, currentIndex, wpm, words, hasText]);

  // Keyboard shortcuts: space toggles play/pause, left arrow jumps back 50.
  useEffect(() => {
    function handleKey(e) {
      if (!hasText) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleJumpBack(50);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasText, handleTogglePlay, handleJumpBack]);

  const currentWord = hasText && currentIndex < words.length ? words[currentIndex] : null;

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">RSVP</span>
        {sourceName && <span className="app-source">{sourceName}</span>}
      </header>

      <main className="app-main">
        {!hasText ? (
          <FileUpload onTextReady={handleTextReady} />
        ) : (
          <>
            <RSVPDisplay word={currentWord} placeholder={isFinished ? 'Done' : ''} />
            <Controls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onRestart={handleRestart}
              onJumpBack={handleJumpBack}
              wpm={wpm}
              onWpmChange={setWpm}
              currentIndex={currentIndex}
              totalWords={words.length}
              onNewText={handleNewText}
              onSeek={handleSeek}
            />
          </>
        )}
      </main>

      {hasText && (
        <footer className="app-footer">
          <span>space — play / pause &nbsp;·&nbsp; ← — back 50 words</span>
        </footer>
      )}
    </div>
  );
}
