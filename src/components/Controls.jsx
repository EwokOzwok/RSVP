const JUMP_AMOUNTS = [50, 100, 200, 500];

export default function Controls({
  isPlaying,
  onTogglePlay,
  onRestart,
  onJumpBack,
  wpm,
  onWpmChange,
  currentIndex,
  totalWords,
  onNewText,
}) {
  const progress = totalWords ? Math.min(currentIndex / totalWords, 1) : 0;
  const isFinished = totalWords > 0 && currentIndex >= totalWords;

  return (
    <div className="controls">
      <div className="progress-row">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="progress-label">
          {Math.min(currentIndex, totalWords)} / {totalWords} words
        </span>
      </div>

      <div className="jump-row">
        <span className="jump-row-label">Jump back</span>
        {JUMP_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            className="btn btn-jump"
            onClick={() => onJumpBack(amount)}
            disabled={currentIndex <= 0}
          >
            ⟲ {amount}
          </button>
        ))}
      </div>

      <div className="main-row">
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          ⟲ Restart
        </button>

        <button type="button" className="btn btn-play" onClick={onTogglePlay}>
          {isFinished ? '↻ Replay' : isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button type="button" className="btn btn-ghost" onClick={onNewText}>
          New text
        </button>
      </div>

      <div className="speed-row">
        <label htmlFor="speed-slider">Speed</label>
        <input
          id="speed-slider"
          type="range"
          min={100}
          max={1000}
          step={25}
          value={wpm}
          onChange={(e) => onWpmChange(Number(e.target.value))}
        />
        <span className="speed-value">{wpm} wpm</span>
      </div>
    </div>
  );
}
