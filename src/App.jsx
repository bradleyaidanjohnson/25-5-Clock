import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25000);
  const [timeLeftFormatted, setTimeLeftFormatted] = useState("25:00");
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [now, setNow] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const timeRemainingRef = useRef(null);

  function formatTime(unformattedTime) {
    const formattedTime = unformattedTime * 60000;
    return formattedTime;
  }

  function pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  function changeBreak(int) {
    if (breakLength + int > 0 && breakLength + int <= 60) {
      setBreakLength(breakLength + int);
    } else {
      return;
    }
  }

  function changeSession(int) {
    if (sessionLength + int > 0 && sessionLength + int <= 60) {
      setSessionLength(sessionLength + int);
    } else {
      return;
    }
  }

  function start() {
    setTimerRunning(true);
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(timeRemainingRef.current);
    timeRemainingRef.current = setInterval(() => {
      setNow(Date.now());
      setTimerRunning(true);
    }, 1000);
  }

  function stop() {
    clearInterval(timeRemainingRef.current);
    setTimerRunning(false);
  }

  const sessionTimeFormatted = formatTime(sessionLength);
  const differential = now - startTime;
  const testTimeLeft = sessionTimeFormatted - differential;
  const minutes = Math.round(testTimeLeft / 60000);
  const seconds = Math.round((testTimeLeft % 60000) / 1000);
  const testTimeLeftFormatted = `${pad(minutes)}:${pad(seconds)}`;

  function reset() {
    setTimerRunning(false);
    setBreakLength(5);
    setSessionLength(25);
  }

  return (
    <div>
      <div>
        <div>
          <span id="break-label">Break Length </span>
          <span id="break-length">{breakLength}</span>
        </div>
        <div>
          <span id="session-label">Session Length </span>
          <span id="session-length">{sessionLength}</span>
        </div>
      </div>
      <div>
        <button id="break-decrement" onClick={() => changeBreak(-1)}>
          Decrement Break
        </button>
        <button id="session-decrement" onClick={() => changeSession(-1)}>
          Decrement Session
        </button>
      </div>
      <div>
        <button id="break-increment" onClick={() => changeBreak(+1)}>
          Increment Break
        </button>
        <button id="session-increment" onClick={() => changeSession(+1)}>
          Increment Session
        </button>
      </div>
      <div>
        <span id="timer-label">Session </span>
        <span id="time-left">{testTimeLeftFormatted}</span>
      </div>
      <div>
        <button id="start_stop" onClick={!timerRunning ? start : stop}>
          {!timerRunning ? `Start` : `Stop`}
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
