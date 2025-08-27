import { useState } from "react";
import Timer from "./components/Timer";
import Stopwatch from "./components/Stopwatch";
import Alarm from "./components/Alarm";
import "./styles/global.css";

function App() {
  const [view, setView] = useState("timer"); // timer | stopwatch | alarm

  return (
    <div className="app-container">
      <h1>⏱ Online Timer Tool</h1>

      {/* Navigation */}
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

      {/* Tool View */}
      <div className="view tool-card">
        {view === "timer" && <Timer />}
        {view === "stopwatch" && <Stopwatch />}
        {view === "alarm" && <Alarm />}
      </div>
    </div>
  );
}

export default App;
