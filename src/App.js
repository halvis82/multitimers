import './App.css'
import Timer from "./components/Timer"

function App() {
  return (
    <div className="App">
      <h1>Multi timers</h1>
      <div className='multiTimerContainer'>
        <Timer potentialTimerTime="30000" />
        <Timer potentialTimerTime="60000" />
        <Timer potentialTimerTime="300000" />
        <Timer potentialTimerTime="" />
      </div>
    </div>
  )
}

export default App