import { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../styles/Timer.css";

const LOCAL_STORAGE_KEY = "timerLabels";

function Timer() {
  const [time, setTime] = useState(60);
  const [inputTime, setInputTime] = useState(60);

  // Labels management
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [addingNewLabel, setAddingNewLabel] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState("");

  const [editingLabel, setEditingLabel] = useState(false);
  const [editLabelInput, setEditLabelInput] = useState("");

  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  // Load labels from localStorage on mount
  useEffect(() => {
    const savedLabels =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setLabels(savedLabels);
    setSelectedLabel(savedLabels[0] || "");
  }, []);

  // Save labels to localStorage when changed
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(labels));
  }, [labels]);

  // Timer logic unchanged
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

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTime(inputTime);
  };

  const playAlarm = () => {
    const audioFile = "/alarm.mp3";
    const audio = new Audio(audioFile);
    audio.play().catch(() => {
      playBeep();
    });
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

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const progress =
    time > 0 ? ((inputTime - time) / inputTime) * circumference : circumference;

  const getColor = () => {
    const ratio = time / inputTime;
    if (ratio > 0.6) return "#22c55e"; // green
    if (ratio > 0.3) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  // Label handlers
  const handleLabelSelect = (e) => {
    const val = e.target.value;
    if (val === "__add_new__") {
      setAddingNewLabel(true);
      setNewLabelInput("");
      setSelectedLabel("");
      setEditingLabel(false);
    } else {
      setSelectedLabel(val);
      setAddingNewLabel(false);
      setEditingLabel(false);
    }
  };

  const addNewLabel = () => {
    const trimmed = newLabelInput.trim();
    if (trimmed) {
      if (!labels.includes(trimmed)) {
        const updated = [...labels, trimmed];
        setLabels(updated);
        setSelectedLabel(trimmed);
      } else {
        setSelectedLabel(trimmed);
      }
      setAddingNewLabel(false);
      setNewLabelInput("");
    }
  };

  const cancelAddNewLabel = () => {
    setAddingNewLabel(false);
    setNewLabelInput("");
    setSelectedLabel(labels[0] || "");
  };

  const onNewLabelKeyDown = (e) => {
    if (e.key === "Enter") addNewLabel();
    if (e.key === "Escape") cancelAddNewLabel();
  };

  // Delete label
  const deleteLabel = (labelToDelete, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Delete label "${labelToDelete}"?`)) {
      const filtered = labels.filter((l) => l !== labelToDelete);
      setLabels(filtered);
      if (selectedLabel === labelToDelete) {
        setSelectedLabel(filtered[0] || "");
      }
      if (editingLabel && editLabelInput === labelToDelete) {
        setEditingLabel(false);
        setEditLabelInput("");
      }
    }
  };

  // Start editing selected label
  const startEditingLabel = () => {
    setEditingLabel(true);
    setEditLabelInput(selectedLabel);
    setAddingNewLabel(false);
  };

  // Save edited label
  const saveEditedLabel = () => {
    const trimmed = editLabelInput.trim();
    if (!trimmed) return; // ignore empty

    if (trimmed === selectedLabel) {
      setEditingLabel(false);
      return;
    }

    if (labels.includes(trimmed)) {
      alert("Label already exists.");
      return;
    }

    const updatedLabels = labels.map((lbl) =>
      lbl === selectedLabel ? trimmed : lbl
    );
    setLabels(updatedLabels);
    setSelectedLabel(trimmed);
    setEditingLabel(false);
  };

  const cancelEditingLabel = () => {
    setEditingLabel(false);
    setEditLabelInput("");
  };

  const onEditLabelKeyDown = (e) => {
    if (e.key === "Enter") saveEditedLabel();
    if (e.key === "Escape") cancelEditingLabel();
  };

  return (
    <div
      className="timer-container"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h2>⏲ Countdown Timer</h2>

      {/* Label select / add new / edit */}
      <div style={{ marginBottom: "1rem", position: "relative" }}>
        {!addingNewLabel && !editingLabel && (
          <>
            <select
              value={selectedLabel}
              onChange={handleLabelSelect}
              disabled={isActive}
              style={{
                padding: "0.5rem 1.5rem 0.5rem 0.5rem",
                fontSize: "1.1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                width: "100%",
                cursor: isActive ? "not-allowed" : "pointer",
              }}
            >
              {labels.length === 0 && (
                <option value="" disabled>
                  No labels yet
                </option>
              )}
              {labels.map((lbl) => (
                <option key={lbl} value={lbl}>
                  {lbl}
                </option>
              ))}
              <option value="__add_new__">+ Add New Label...</option>
            </select>
            {/* Edit and delete buttons next to dropdown */}
            {selectedLabel && !isActive && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={startEditingLabel}
                  title="Edit Label"
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    color: "#007bff",
                    fontSize: "1.2rem",
                    padding: 0,
                  }}
                  aria-label="Edit label"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => deleteLabel(selectedLabel, e)}
                  title="Delete Label"
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    color: "red",
                    fontSize: "1.2rem",
                    padding: 0,
                  }}
                  aria-label="Delete label"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </>
        )}

        {/* Adding new label input */}
        {addingNewLabel && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              autoFocus
              placeholder="Type new label"
              value={newLabelInput}
              onChange={(e) => setNewLabelInput(e.target.value)}
              onKeyDown={onNewLabelKeyDown}
              disabled={isActive}
              style={{
                flex: 1,
                padding: "0.5rem",
                fontSize: "1.1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              aria-label="New label input"
            />
            <button
              onClick={addNewLabel}
              disabled={!newLabelInput.trim() || isActive}
              style={{
                padding: "0.5rem 1rem",
                cursor:
                  newLabelInput.trim() && !isActive ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
            <button
              onClick={cancelAddNewLabel}
              style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
              aria-label="Cancel adding new label"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Editing label input */}
        {editingLabel && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              autoFocus
              value={editLabelInput}
              onChange={(e) => setEditLabelInput(e.target.value)}
              onKeyDown={onEditLabelKeyDown}
              disabled={isActive}
              style={{
                flex: 1,
                padding: "0.5rem",
                fontSize: "1.1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              aria-label="Edit label input"
            />
            <button
              onClick={saveEditedLabel}
              disabled={!editLabelInput.trim() || isActive}
              style={{
                padding: "0.5rem 1rem",
                cursor:
                  editLabelInput.trim() && !isActive
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              Save
            </button>
            <button
              onClick={cancelEditingLabel}
              style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
              aria-label="Cancel editing label"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Show selected label above timer */}
      <h3 style={{ margin: "0.5rem 0", color: getColor() }}>
        {selectedLabel || "No label selected"}
      </h3>

      {/* Input to set seconds */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          min="1"
          value={inputTime}
          onChange={(e) => setInputTime(Number(e.target.value))}
          disabled={isActive}
          style={{ padding: "0.5rem", width: "80px", marginRight: "0.5rem" }}
        />
        <button onClick={() => setTime(inputTime)} disabled={isActive}>
          Set Time
        </button>
      </div>

      {/* Circle progress */}
      <div
        className="circle-wrapper"
        style={{ position: "relative", width: "220px", margin: "auto" }}
      >
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

        <div
          className="timer-text"
          style={{
            fontWeight: "bold",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "2rem",
          }}
        >
          {formatTime(time)}
        </div>
      </div>

      {/* Buttons */}
      <div
        className="timer-buttons"
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
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
