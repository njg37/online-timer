import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Timer from "./components/Timer";
import Stopwatch from "./components/Stopwatch";
import Alarm from "./components/Alarm";
import "./styles/global.css";

function App() {
  const [view, setView] = useState("timer");
  const [showWelcome, setShowWelcome] = useState(true);
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.add(savedTheme);
  }, []);

  // Apply theme class to body and save to localStorage
  useEffect(() => {
    document.body.classList.remove(theme === "light" ? "dark" : "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
            {view === "stopwatch" && <Stopwatch />}
            {view === "alarm" && <Alarm />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
