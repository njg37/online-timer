import { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../styles/Alarm.css";

function Alarm({ alarms, setAlarms }) {
  const [showModal, setShowModal] = useState(false);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmLabel, setAlarmLabel] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const audioRef = useRef(null);
  const checkRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Alarm checking
  useEffect(() => {
    checkRef.current = setInterval(() => {
      const now = new Date();
      const nowStr = now.toTimeString().slice(0, 5); // HH:MM
      alarms.forEach((alarm) => {
        if (alarm.time === nowStr && !alarm.triggered) {
          triggerAlarm(alarm.id);
        }
      });
    }, 1000);
    return () => clearInterval(checkRef.current);
  }, [alarms]);

  const triggerAlarm = (id) => {
    playAlarm();
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, triggered: true } : alarm
      )
    );
  };

  const playAlarm = () => {
    const audio = new Audio("/alarm.mp3");
    audioRef.current = audio;
    audio.play().catch(playBeep);
  };

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

  const addOrEditAlarm = () => {
    if (!alarmTime) return;
    const newAlarm = {
      id: editId || Date.now(),
      time: alarmTime,
      label: alarmLabel || "Unnamed Alarm",
      triggered: false,
    };

    if (editId) {
      setAlarms((prev) =>
        prev.map((a) => (a.id === editId ? newAlarm : a))
      );
    } else {
      setAlarms([...alarms, newAlarm]);
    }

    setAlarmTime("");
    setAlarmLabel("");
    setEditId(null);
    setShowModal(false);
  };

  const deleteAlarm = (id) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Clear all alarms?")) {
      setAlarms([]);
    }
  };

  const editAlarm = (id) => {
    const toEdit = alarms.find((a) => a.id === id);
    if (toEdit) {
      setAlarmTime(toEdit.time);
      setAlarmLabel(toEdit.label);
      setEditId(id);
      setShowModal(true);
    }
  };

  const formatDigitalTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="alarm-container">
      <h2>⏰ Alarm</h2>

      {/* Animated Digital Clock */}
      <div className="digital-clock animated">
        {formatDigitalTime(currentTime)}
      </div>

      {/* Controls */}
      <div className="alarm-controls">
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ Add Alarm
        </button>
        {alarms.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {/* Alarm List */}
      <div className="alarm-list">
        {alarms.map((alarm) => (
          <div key={alarm.id} className="alarm-item">
            <span>
              ⏰ {alarm.time} — {alarm.label}
            </span>
            <div className="alarm-actions">
              <button onClick={() => editAlarm(alarm.id)} title="Edit">
                <FaEdit />
              </button>
              <button onClick={() => deleteAlarm(alarm.id)} title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? "Edit Alarm" : "Set New Alarm"}</h3>
            <input
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="Label (optional)"
              value={alarmLabel}
              onChange={(e) => setAlarmLabel(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={addOrEditAlarm}>
                {editId ? "Update Alarm" : "Add Alarm"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                  setAlarmTime("");
                  setAlarmLabel("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alarm;
