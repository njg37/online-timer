import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Timer from "./components/Timer";
import Stopwatch from "./components/Stopwatch";
import Alarm from "./components/Alarm";
import "./styles/global.css";

function App() {
  const [view, setView] = useState("timer");
  const [theme, setTheme] = useState("light");
  const [showAssistant, setShowAssistant] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  // Lifted state for Alarm and Stopwatch
  const [alarms, setAlarms] = useState([]);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchIsActive, setStopwatchIsActive] = useState(false);
  const [stopwatchLaps, setStopwatchLaps] = useState([]);

  // Load theme, alarms, stopwatch from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.add(savedTheme);

    const savedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];
    setAlarms(savedAlarms);

    const savedStopwatch = JSON.parse(localStorage.getItem("stopwatch")) || {
      time: 0,
      isActive: false,
      laps: [],
    };
    setStopwatchTime(savedStopwatch.time);
    setStopwatchIsActive(savedStopwatch.isActive);
    setStopwatchLaps(savedStopwatch.laps);
  }, []);

  // Apply theme and save it
  useEffect(() => {
    document.body.classList.remove(theme === "light" ? "dark" : "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Save stopwatch state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "stopwatch",
      JSON.stringify({
        time: stopwatchTime,
        isActive: stopwatchIsActive,
        laps: stopwatchLaps,
      })
    );
  }, [stopwatchTime, stopwatchIsActive, stopwatchLaps]);

  // Show welcome screen briefly
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleAssistantChoice = (choice) => {
    setView(choice.toLowerCase());
    setShowAssistant(false);
  };

  return (
    <div className="app-container">
      {showWelcome ? (
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          👋 Welcome to Online Timer
        </motion.h1>
      ) : showAssistant ? (
        <motion.div
          className="assistant-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bubble">
            <p>🤖 Hello! What would you like to use today?</p>
            <div className="choices">
              {["Timer", "Stopwatch", "Alarm"].map((option) => (
                <button key={option} onClick={() => handleAssistantChoice(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="header">
            <h1>⏱ Online Timer Tool</h1>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>

          <div className="nav">
            <button
              className={view === "timer" ? "active" : ""}
              onClick={() => setView("timer")}
            >
              Timer
            </button>
            <button
              className={view === "stopwatch" ? "active" : ""}
              onClick={() => setView("stopwatch")}
            >
              Stopwatch
            </button>
            <button
              className={view === "alarm" ? "active" : ""}
              onClick={() => setView("alarm")}
            >
              Alarm
            </button>
          </div>

          <div className="view tool-card">
            {view === "timer" && <Timer />}
            {view === "stopwatch" && (
              <Stopwatch
                time={stopwatchTime}
                setTime={setStopwatchTime}
                isActive={stopwatchIsActive}
                setIsActive={setStopwatchIsActive}
                laps={stopwatchLaps}
                setLaps={setStopwatchLaps}
              />
            )}
            {view === "alarm" && <Alarm alarms={alarms} setAlarms={setAlarms} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
