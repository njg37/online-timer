import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Timer from "./components/Timer";
import Stopwatch from "./components/Stopwatch";
import Alarm from "./components/Alarm";
import "./styles/global.css";

function App() {
  const [view, setView] = useState("timer"); 
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000); // hide after 2s
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
          <h1>⏱ Online Timer Tool</h1>
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
