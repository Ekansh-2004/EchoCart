import React, { useState } from "react";
import "./Main.css";

const Main = () => {
  const [toggle, setToggle] = useState(false);
  const [duration, setDuration] = useState(15);

  return (
    <div className="main-home-container">
      <div className="main-toggle-section">
        <div className="main-toggle-status">
          <span className={toggle ? "ai-on" : "ai-off"}>
            AI Assistant: {toggle ? "ON" : "OFF"}
          </span>
        </div>
        <label className="main-toggle-label">
          <input
            type="checkbox"
            checked={toggle}
            onChange={() => setToggle((prev) => !prev)}
            className="main-toggle-input"
          />
          <span
            className={`main-toggle-slider main-toggle-slider-big${
              toggle ? " on" : ""
            }`}
          ></span>
        </label>
      </div>
      <div className="main-time-section">
        <label htmlFor="duration" className="main-time-label">
          Select Duration (in minutes)
        </label>
        <select
          id="duration"
          className="main-time-dropdown"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          {Array.from({ length: 59 }, (_, i) => i + 1).map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Main;
