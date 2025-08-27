import { useState, useEffect, useRef } from "react";
import "../styles/Timer.css"

function Timer() {
  const [time, setTime] = useState(60);        // countdown time in seconds
  const [inputTime, setInputTime] = useState(60); // input field value
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

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
      // If file not found or autoplay blocked → fallback beep
      playBeep();
    });
  };

  // Pure JS beep (Web Audio API)
  const playBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine"; // sound type
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime); // 1kHz tone
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // volume

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 1); // play 1 sec
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

  return (
    <div>
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
        <button
          onClick={() => setTime(inputTime)}
          disabled={isActive}
        >
          Set Time
        </button>
      </div>

      <h1>{formatTime(time)}</h1>

      <div>
        <button onClick={startTimer} disabled={isActive}>Start</button>
        <button onClick={stopTimer} disabled={!isActive}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default Timer;
