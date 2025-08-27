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

      <div className="nav">
        <button onClick={() => setView("timer")}>Timer</button>
        <button onClick={() => setView("stopwatch")}>Stopwatch</button>
        <button onClick={() => setView("alarm")}>Alarm</button>
      </div>

      <div className="view">
        {view === "timer" && <Timer />}
        {view === "stopwatch" && <Stopwatch />}
        {view === "alarm" && <Alarm />}
      </div>
    </div>
  );
}

export default App;
