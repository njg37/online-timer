import { useState, useEffect, useRef } from "react";
import "../styles/timer.css";

function Timer() {
  const [time, setTime] = useState(60); // countdown time in seconds
  const [inputTime, setInputTime] = useState(60); // input field value
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  // Circle progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // Start countdown
  const startTimer = () => {
    if (!isActive && time > 0) {
      setIsActive(true);
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Stop countdown
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTime(inputTime); // reset to input time
  };

  // Play alarm sound when finished
  const playAlarm = () => {
    const audioFile = "/alarm.mp3"; // place alarm.mp3 in public/
    const audio = new Audio(audioFile);
    audio.play().catch(() => {
      playBeep();
    });
  };

  // Pure JS beep (Web Audio API)
  const playBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 1);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Format seconds → MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Circle progress calculation
  const progress =
    time > 0 ? ((inputTime - time) / inputTime) * circumference : circumference;

  // Dynamic color (Green → Yellow → Red)
  const getColor = () => {
    const ratio = time / inputTime;
    if (ratio > 0.6) return "#22c55e"; // green
    if (ratio > 0.3) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="timer-container">
      <h2>⏲ Countdown Timer</h2>

      {/* Input to set custom seconds */}
      <div style={{ margin: "1rem 0" }}>
        <input
          type="number"
          min="1"
          value={inputTime}
          onChange={(e) => setInputTime(Number(e.target.value))}
          disabled={isActive}
        />
        <button onClick={() => setTime(inputTime)} disabled={isActive}>
          Set Time
        </button>
      </div>

      {/* Countdown Circle */}
      <div className="circle-wrapper">
        <svg className="progress-ring" width="220" height="220">
          <circle
            className="progress-ring__circle--bg"
            stroke="#ddd"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="110"
            cy="110"
          />
          <circle
            className="progress-ring__circle"
            stroke={getColor()}
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="110"
            cy="110"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>

        <div className="timer-text">{formatTime(time)}</div>
      </div>

      {/* Buttons */}
      <div className="timer-buttons">
        <button onClick={startTimer} disabled={isActive}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isActive}>
          Stop
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default Timer;
