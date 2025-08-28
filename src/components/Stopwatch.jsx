import { useRef, useEffect } from "react";
import "../styles/Stopwatch.css";

function Stopwatch({ time, setTime, isActive, setIsActive, laps, setLaps }) {
  const timerRef = useRef(null);

  const startStopwatch = () => {
    if (!isActive) {
      setIsActive(true);
      const start = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - start);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
  };

  const resetStopwatch = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (isActive) {
      setLaps([...laps, time]);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Format time safely and prevent absurdly large values
  const formatTime = (ms) => {
    if (ms < 0) ms = 0;

    // Maximum time display (e.g., 99:59:99)
    const maxMs = (99 * 60 + 59) * 1000 + 990; 
    if (ms > maxMs) ms = maxMs;

    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div className="stopwatch-container tool-card">
      <h2>⏱ Stopwatch</h2>
      <div className={`stopwatch-time ${isActive ? "active" : ""}`}>
        {formatTime(time)}
      </div>

      <div className="stopwatch-buttons">
        <button className="start-btn" onClick={startStopwatch} disabled={isActive}>
          Start
        </button>
        <button className="stop-btn" onClick={stopStopwatch} disabled={!isActive}>
          Stop
        </button>
        <button className="reset-btn" onClick={resetStopwatch}>
          Reset
        </button>
        <button className="lap-btn" onClick={addLap} disabled={!isActive}>
          Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-container">
          <h3>Laps</h3>
          <div className="lap-list">
            {laps.map((lap, i) => (
              <div key={i} className="lap-item">
                <span>Lap {i + 1}</span>
                <span>{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
