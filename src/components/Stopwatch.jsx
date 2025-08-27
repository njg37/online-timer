import { useState, useRef, useEffect } from "react";
import "../styles/Stopwatch.css"
function Stopwatch() {
  const [time, setTime] = useState(0); // in ms
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  // Start stopwatch
  const startStopwatch = () => {
    if (!isActive) {
      setIsActive(true);
      const start = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - start);
      }, 10); // update every 10ms
    }
  };

  // Stop stopwatch
  const stopStopwatch = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
  };

  // Reset stopwatch
  const resetStopwatch = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  // Add lap
  const addLap = () => {
    if (isActive) {
      setLaps([...laps, time]);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Format time → MM:SS:MS
  const formatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div>
      <h2>⏱ Stopwatch</h2>
      <h1>{formatTime(time)}</h1>

      <div>
        <button onClick={startStopwatch} disabled={isActive}>Start</button>
        <button onClick={stopStopwatch} disabled={!isActive}>Stop</button>
        <button onClick={resetStopwatch}>Reset</button>
        <button onClick={addLap} disabled={!isActive}>Lap</button>
      </div>

      {/* Laps list */}
      {laps.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Laps</h3>
          <ol>
            {laps.map((lap, i) => (
              <li key={i}>{formatTime(lap)}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
