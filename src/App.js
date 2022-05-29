import './App.css'
import Timer from "./components/Timer"

function App() {
  return (
    <div className="App">
      <h1>Multi timers</h1>
      <div className='timerContainer'>
        <Timer TimerOrStopclock="timer" />
        <Timer TimerOrStopclock="timer" />
        <Timer TimerOrStopclock="timer" />
        <Timer TimerOrStopclock="" />
      </div>
    </div>
  )
}

export default App