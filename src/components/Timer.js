import React from 'react'
import { useState, useEffect } from 'react'

const Timer = ({ TimerOrStopwatch }) => {
  // Variables
  const greenIsh = "#92D293"
  const redIsh = "#e0474c"
  const blueIsh = "#91B2F7"
  const whiteIsh = "#F8F0E3"
  const standardTimer = 60

  // States
  const [isTimer, setIsTimer] = useState(Boolean(TimerOrStopwatch))
  const [typing, setTyping] = useState(false)
  const [time, setTime] = useState(0)
  const [timeInUnits, setTimeInUnits] = useState(["00", "00", "00", "00"])
  const [originalTimerTime, setOriginalTimerTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [startTime, setStartTime] = useState()
  const [previousTime, setPreviousTime] = useState(0)
  // const [intervalID, setIntervalID] = useState()

  // Inline styles
  const hoursStyle = {
    display: (time >= 3600000 | typing) ? "block" : "none"
  }
  const minutesStyle = {
    display: (time >= 60000 | typing) ? "block" : "none"
  }
  const csStyle = {
    display: (!isTimer) ? "block" : "none"
  }

  // Functions
  const switchTimer = (e) => {
    e.target.blur()
    setIsTimer(true)
  }

  const switchStopwatch = (e) => {
    e.target.blur()
    setIsTimer(false)
    // setTyping(true)   //for testing
  }

  const secondsToAllUnits = (time) => {
    const date = new Date(time)

    const hours = date.toISOString().substring(11, 13)
    const minutes = date.toISOString().substring(14, 16)
    const seconds = date.toISOString().substring(17, 19)
    const cs = date.toISOString().substring(20, 22)

    return [hours, minutes, seconds, cs]
  }

  const start = () => {
    if (!isTimer) {
      // // setIntervalID(
      //   setInterval(() => {
      //     setTime(time => time + 1)
      //     setTimeInUnits(secondsToAllUnits(time))
      //     console.log(timeInUnits, time)
      //   }, 1000)
      // // )
      // console.log("hello")

      // if (time === 0) {
      //   setTime(time => time + 1) // Apparently necessary before (but only first time?)
      // }

      if (!running) {
        setStartTime(new Date())
        setRunning(true)
      }
    }
  }

  const stop = () => {
    if (!isTimer) {
      setPreviousTime(time)
      setRunning(false)
    }
  }

  const reset = () => {
    if (!isTimer) {
      setPreviousTime(0)
      setTimeInUnits(secondsToAllUnits(0))
      setTime(0)
      setRunning(false)
    }
  }

  useEffect(() => {
    let interval = null

    if (running) {
      interval = setInterval(() => {
        // setTime(time => time + 1)
        // setTimeInUnits(secondsToAllUnits(time))
        // console.log(timeInUnits, time)

        setTime(previousTime + new Date().getTime() - startTime.getTime())
        setTimeInUnits(secondsToAllUnits(time))
      }, 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  })

  return (
    <div className='timerBox'>
      <div className='timerContentBox'>

        <div className='buttonBox'>
          <input type="button" value="Timer" onClick={switchTimer} style={{backgroundColor: (isTimer) ? greenIsh : redIsh}} />
          <input type="button" value="Stopwatch" onClick={switchStopwatch} style={{backgroundColor: (isTimer) ? redIsh : greenIsh}} />
        </div>

        <div className='timeBox'>
          <span style={hoursStyle}>{timeInUnits[0]}</span>
          <span className='smallUnit' style={hoursStyle}>h</span>
          <span style={minutesStyle}>{timeInUnits[1]}</span>
          <span className='smallUnit' style={minutesStyle}>m</span>
          <span >{timeInUnits[2]}</span>
          <span className='typingIndicator' style={{display: (typing) ? "block" : "none"}}>|</span>
          <span className='smallUnit' style={{marginRight: "6px"}}>s</span>
          <span style={csStyle}>{timeInUnits[3]}</span>
        </div>

        <div className='buttonBox'>
          <input type="button" onClick={(!running) ? (start) : (stop)} value={(!running) ? "START" : "STOP"} style={{backgroundColor: blueIsh}} />
          <input type="button" onClick={(reset)} value="RESET" style={{backgroundColor: whiteIsh, color: "black"}} />
        </div>

      </div>
      
      <div className='timerProgressBox'></div>
    </div>
  )
}

export default Timer