import { useState, useEffect, useRef } from "react";
import "../styles/Alarm.css"

function Alarm() {
  const [alarmTime, setAlarmTime] = useState(""); // store HH:MM
  const [isSet, setIsSet] = useState(false);
  const checkRef = useRef(null);

  // Set alarm
  const setAlarm = () => {
    if (alarmTime) {
      setIsSet(true);
    }
  };

  // Clear alarm
  const clearAlarm = () => {
    setIsSet(false);
    setAlarmTime("");
    clearInterval(checkRef.current);
  };

  // Play alarm sound
  const playAlarm = () => {
    const audioFile = "/alarm.mp3"; // place in public/
    const audio = new Audio(audioFile);
    audio.play().catch(() => playBeep());
  };

  // JS Beep fallback
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

  // Check every second if current time matches alarm
  useEffect(() => {
    if (isSet) {
      checkRef.current = setInterval(() => {
        const now = new Date();
        const current = now.toTimeString().slice(0, 5); // HH:MM
        if (current === alarmTime) {
          playAlarm();
          clearAlarm();
        }
      }, 1000);
    }
    return () => clearInterval(checkRef.current);
  }, [isSet, alarmTime]);

  return (
    <div>
      <h2>⏰ Alarm</h2>

      <div style={{ margin: "1rem 0" }}>
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          disabled={isSet}
        />
        <button onClick={setAlarm} disabled={!alarmTime || isSet}>
          Set Alarm
        </button>
        <button onClick={clearAlarm} disabled={!isSet}>
          Clear Alarm
        </button>
      </div>

      {isSet && <p>🔔 Alarm set for {alarmTime}</p>}
    </div>
  );
}

export default Alarm;
