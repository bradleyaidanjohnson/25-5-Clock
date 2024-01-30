import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25000);
  const [timeLeftFormatted, setTimeLeftFormatted] = useState("25:00");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [now, setNow] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);

  const timeRemainingRef = useRef(null);
  const alarmElement = useRef(null);

  const alarmSoundUrl =
    "https://voiceoff.com/store/media/cms/soundsamples/MP3E010SNX.mp3";

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
    setTimerActive(true);
    if (timerActive && testTimeLeft > 0) {
      setStartTime(Date.now() - (stopTime - startTime));
      setNow(Date.now());
    } else {
      setStartTime(Date.now());
      setNow(Date.now());
    }

    clearInterval(timeRemainingRef.current);
    timeRemainingRef.current = setInterval(() => {
      setNow(Date.now());
      setTimerRunning(true);
    }, 1000);
  }

  function stop() {
    clearInterval(timeRemainingRef.current);
    setStopTime(Date.now());
    setTimerRunning(false);
  }

  function timerEnded() {
    setIsBreak(!isBreak);
    if (!isBreak) {
      alarmElement.current.play();
      setTimerActive(false);
      start();
    } else {
      alarmElement.current.play();
      setTimerActive(false);
      start();
    }
  }

  const currentTimeFormatted = isBreak
    ? formatTime(breakLength)
    : formatTime(sessionLength);
  const differential = now - startTime;
  const testTimeLeft = currentTimeFormatted - differential;
  let testTimeLeftFormatted = "25:00";

  if (testTimeLeft <= 0) {
    testTimeLeftFormatted = "00:00";
    setTimeout(() => {
      timerEnded();
    }, 10);
  } else {
    testTimeLeftFormatted = processTime();
  }
  function processTime() {
    const minutes = Math.floor(testTimeLeft / 60000);
    const seconds = Math.round((testTimeLeft % 60000) / 1000);
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function reset() {
    stop();
    setBreakLength(5);
    setSessionLength(25);
    setStopTime(null);
    setStartTime(null);
    setNow(null);
    setIsBreak(false);
    setTimerActive(false);
    alarmElement.current.pause();
    alarmElement.current.load();
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
        <span id="timer-label">{isBreak ? `Break Time!` : `Session`} </span>
        <span id="time-left">{testTimeLeftFormatted}</span>
      </div>
      <div>
        <button id="start_stop" onClick={!timerRunning ? start : stop}>
          {!timerRunning ? `Start` : `Stop`}
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
        <audio ref={alarmElement} src={alarmSoundUrl} id="beep" />
      </div>
    </div>
  );
}

export default App;
