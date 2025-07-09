import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAIStore } from "../store/useAIStore";
import "./Main.css";

const Main = () => {
  const { socket, connected, error } = useSocket();
  const { 
    isActive, 
    duration, 
    alerts, 
    connectionStatus,
    setSocket, 
    startAI, 
    stopAI, 
    clearAlerts,
    requestNotificationPermission 
  } = useAIStore();
  
  const [localDuration, setLocalDuration] = useState(duration);

  useEffect(() => {
    if (socket) {
      console.log('🔧 Setting socket in Main component');
      setSocket(socket);
      requestNotificationPermission();
    }
  }, [socket, setSocket, requestNotificationPermission]);

  useEffect(() => {
    setLocalDuration(duration);
  }, [duration]);

  const handleToggle = () => {
    if (!connected) {
      alert('❌ Not connected to server. Please check your connection.');
      return;
    }

    if (isActive) {
      stopAI();
    } else {
      startAI(localDuration);
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning');

  return (
    <div className="main-home-container">
      {/* Connection Status */}
      <div className="connection-status">
        <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
        {error && <span className="error-message">Error: {error}</span>}
      </div>

      <div className="main-toggle-section">
        <div className="main-toggle-status">
          <span className={isActive ? "ai-on" : "ai-off"}>
            AI Assistant: {isActive ? "ON" : "OFF"}
          </span>
        </div>
        <label className="main-toggle-label">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleToggle}
            className="main-toggle-input"
            disabled={!connected}
          />
          <span
            className={`main-toggle-slider main-toggle-slider-big${
              isActive ? " on" : ""
            }`}
          ></span>
        </label>
      </div>
      
      <div className="main-time-section">
        <label htmlFor="duration" className="main-time-label">
          Check Interval (minutes)
        </label>
        <select
          id="duration"
          className="main-time-dropdown"
          value={localDuration}
          onChange={(e) => setLocalDuration(Number(e.target.value))}
          disabled={isActive || !connected}
        >
          {Array.from({ length: 59 }, (_, i) => i + 1).map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </select>
      </div>

      {/* Real-time Alerts Display */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <div className="alerts-header">
            <h3>🤖 AI Stock Alerts</h3>
            <button 
              className="clear-alerts-btn"
              onClick={clearAlerts}
            >
              Clear All
            </button>
          </div>
          
          {criticalAlerts.length > 0 && (
            <div className="critical-alerts">
              <h4>🚨 Critical Alerts</h4>
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="alert critical">
                  <strong>{alert.product}</strong>: {alert.message}
                  <br />
                  <small>{alert.recommendation}</small>
                </div>
              ))}
            </div>
          )}
          
          {warningAlerts.length > 0 && (
            <div className="warning-alerts">
              <h4>⚠️ Warning Alerts</h4>
              {warningAlerts.map((alert, index) => (
                <div key={index} className="alert warning">
                  <strong>{alert.product}</strong>: {alert.message}
                  <br />
                  <small>{alert.recommendation}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isActive && connected && (
        <div className="ai-status-indicator">
          <div className="pulse-dot"></div>
          <span>AI monitoring active - checking every {duration} minutes</span>
        </div>
      )}

      {!connected && (
        <div className="connection-warning">
          <p>⚠️ Unable to connect to server. Please ensure the backend is running on port 4001.</p>
        </div>
      )}
    </div>
  );
};

export default Main;