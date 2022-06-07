// Libraries
import React from 'react'
import { useState, useEffect } from 'react'
import useSound from "use-sound"
import alarmSound from "../assets/alarm.wav"
// https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/


const Timer = ({ potentialTimerTime }) => {
  // Colors/variables
  const greenIsh = "#92D293"
  const redIsh = "#e0474c"
  const blueIsh = "#91B2F7"
  const whiteIsh = "#F8F0E3"
  const typingBackground = "#7d8485"
  const normalBackground = "#96A4A5"

  
  // Early functions
  const msToAllUnits = (time) => {
    const date = new Date(time)
    return [
      date.toISOString().substring(11, 12),
      date.toISOString().substring(12, 13),
      date.toISOString().substring(14, 15),
      date.toISOString().substring(15, 16),
      date.toISOString().substring(17, 18),
      date.toISOString().substring(18, 19),
      date.toISOString().substring(20, 21),
      date.toISOString().substring(21, 22)
    ]
  }

  const getTranslucentNumber = (index) => {
    for (let i = 0; i < timeInUnits.length - index; i++) {
      if (timeInUnits[i] !== "0") {
        return false
      }
    }

    return true
  }

  // window.onbeforeunload = () => {
  //   return "Are you sure you want to exit?"
  // }


  // States
  const [isTimer, setIsTimer] = useState(Boolean(potentialTimerTime))
  const [typing, setTyping] = useState(false)
  const [originalTimerTime, setOriginalTimerTime] = useState((!potentialTimerTime) ? 60000 : +potentialTimerTime)
  const [time, setTime] = useState(0)
  const [timeInUnits, setTimeInUnits] = useState((isTimer) ? msToAllUnits(originalTimerTime) : ["0", "0", "0", "0", "0", "0", "0", "0"])
  const [running, setRunning] = useState(false)
  const [startTime, setStartTime] = useState()
  const [previousTime, setPreviousTime] = useState(0)
  const [timerOver, setTimerOver] = useState(false)
  const [playAlarm, { stop }] = useSound(alarmSound)
  const [progressbarStyle, setProgressbarStyle] = useState({
    visibility: "hidden"
  })
  const [startAfter, setStartAfter] = useState(false)


  // Inline styles
  const allTimeStyles = [
    { // hours
      opacity: (typing && getTranslucentNumber(7)) ? "0.3" : "1",
      display: ((isTimer && originalTimerTime - time >= 36000000) || (!isTimer && time >= 36000000) | typing) ? "block" : "none"
    },
    {
      opacity: (typing && getTranslucentNumber(6)) ? "0.3" : "1",
      display: ((isTimer && originalTimerTime - time >= 3600000) || (!isTimer && time >= 3600000) | typing) ? "block" : "none"
    },

    { // mins
      opacity: (typing && getTranslucentNumber(5)) ? "0.3" : "1",
      display: ((isTimer && originalTimerTime - time >= 600000) || (!isTimer && time >= 600000) | typing) ? "block" : "none"
    },
    {
      opacity: (typing && getTranslucentNumber(4)) ? "0.3" : "1",
      display: ((isTimer && originalTimerTime - time >= 60000) || (!isTimer && time >= 60000) | typing) ? "block" : "none"
    },

    { // seconds
      opacity: (typing && getTranslucentNumber(3)) ? "0.3" : "1",
      display: ((isTimer && originalTimerTime - time >= 10000) || (!isTimer && time >= 10000) | typing) ? "block" : "none"
    },
    {opacity: (typing && getTranslucentNumber(2)) ? "0.3" : "1"},

    {display: (!isTimer) ? "block" : "none"} // cs
  ]


  // Control timer/stopwatch
  const start = () => {
    if (isTimer && originalTimerTime === 0) {
      return
    }

    if (!running) {
      setStartTime(new Date())
      setRunning(true)
    }

    if (isTimer) {
      setProgressbarStyle({
        visibility: "visible",
        animation: `fill linear reverse ${originalTimerTime / 1000}s`,
      })
    }
  }

  const stopTime = () => {
    setPreviousTime(
      (isTimer)
      ?
      time + 1000
      :
      time
    )
    setRunning(false)

    if (isTimer) {
      setProgressbarStyle({
        animation: `fill linear reverse ${originalTimerTime / 1000}s paused`
      })
    }
  }

  const reset = () => {
    setPreviousTime(0)
    setTimeInUnits(msToAllUnits((isTimer) ? originalTimerTime : 0))
    setTime(0)
    setRunning(false)

    if (isTimer) {
      setProgressbarStyle({
        visibility: "hidden",
        animation: ``
      })
    }
  }
  
  const switchButton = (e) => {
    // Quit if selected button pressed
    if (e.target.style.backgroundColor === "rgb(146, 210, 147)" /* greenIsh */) {
      return
    }

    e.target.blur()
    reset()
    setTime(0)
    setIsTimer(!isTimer)

    // Stopwatch (because state hasn't updated yet)
    if (isTimer) {
      setTimeInUnits(msToAllUnits(0))
  
      setProgressbarStyle({
        visibility: "hidden"
      })
    }
    // Timer
    else {
      setTimeInUnits(msToAllUnits(originalTimerTime))
    }
  }


  // Timer done
  const timerDone = () => {
    stopTime()
    setTimerOver(true) // Turn on flash
    playAlarm()
  }

  const stopTimer = () => {
    setTimerOver(false)
    reset()
    stop()
  }


  // Main continuous loop
  useEffect(() => {
    if (startAfter) {
      start()
      setStartAfter(false)
    }

    let interval = null

    // if (!running && !isTimer && previousTime === 0) {  //this not working, but solution maybe something like this
    //   if (+timeInUnits[5] !== 0) {
    //     setTimeInUnits(msToAllUnits(0))
    //   }
    // }

    if (running) {
      interval = setInterval(() => {
        if (typing) {
          reset()
        }

        if (isTimer) {
          setTime(previousTime + new Date().getTime() - startTime.getTime() - 1000)
  
          if (previousTime + new Date().getTime() - startTime.getTime() > originalTimerTime /*+ 50*/   /* to let it hit '0' */) {
            timerDone()
            clearInterval()
          }
  
          setTimeInUnits(msToAllUnits(originalTimerTime - time))
        }

        if (!isTimer) {
          setTime(previousTime + new Date().getTime() - startTime.getTime())
          setTimeInUnits(msToAllUnits(time))
        }
        
        // if (isTimer && previousTime + new Date().getTime() - startTime.getTime() > originalTimerTime + 10 /* to let it hit '0' */) {
        //     timerDone()
        //     clearInterval()
        // }
        
        // setTime(previousTime + new Date().getTime() - startTime.getTime() - (isTimer) ? 1000 : 0)
        // setTimeInUnits(msToAllUnits((isTimer) ? (originalTimerTime - time) : time))
      }, 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  })


  // Typing in time
  const startTyping = (e) => {
    if (!isTimer) {
      return
    }
    setTyping(true)
  }

  const stopTyping = () => {
    setTyping(false)

    const timeText = timeInUnits.toString().replace(/,/g, '')
    let timeINms = 0
    timeINms += +timeText.substring(0, 2) * 3600
    timeINms += +timeText.substring(2, 4) * 60
    timeINms += +timeText.substring(4, 6)
    timeINms *= 1000


    setOriginalTimerTime(timeINms)
    setTimeInUnits(msToAllUnits(timeINms))
  }

  const typeTime = (e) => {
    if (!typing) {
      return
    }

    const key = e.key.toLowerCase()
    const timeText = timeInUnits.toString().replace(/,/g, '')

    if (key === "backspace") {
      let newTime = "0" + timeText.substring(0, 5) + "00"

      
      setTimeInUnits([
        newTime.substring(0, 1),
        newTime.substring(1, 2),
        newTime.substring(2, 3),
        newTime.substring(3, 4),
        newTime.substring(4, 5),
        newTime.substring(5, 6),
        "0",
        "0",
      ])
    }
    
    else if (key === "enter" || key === " " /* space */) {
      stopTyping()
      setStartAfter(true)

      e.target.blur()
    }

    else if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(+key)) {
      let newTime = timeText.substring(1, 6) + key.toString()

      setTimeInUnits([
        newTime.substring(0, 1),
        newTime.substring(1, 2),
        newTime.substring(2, 3),
        newTime.substring(3, 4),
        newTime.substring(4, 5),
        newTime.substring(5, 6),
        "0",
        "0",
      ])
    }

    // also add arrows to move cursor around maybe
  }


  return (
    <div className='timerBox'>
      <div className='timerContentBox'>

        {/* Switch buttons */}
        <div className='buttonBox'>
          <input type="button" value="Timer" onClick={switchButton} style={{backgroundColor: (isTimer) ? greenIsh : redIsh}} />
          <input type="button" value="Stopwatch" onClick={switchButton} style={{backgroundColor: (isTimer) ? redIsh : greenIsh}} />
        </div>

        {/* Time text */}
        <div style={{backgroundColor: (typing) ? typingBackground : normalBackground}} tabIndex={"0"} className='timeTextBox' onFocus={startTyping} onClick={startTyping} onBlur={stopTyping} onKeyDown={typeTime}>
          <span style={allTimeStyles[0]}>{timeInUnits[0]}</span>
          <span style={allTimeStyles[1]}>{timeInUnits[1]}</span>
          <span className='smallUnit' style={allTimeStyles[1]}>h</span>
          <span style={allTimeStyles[2]}>{timeInUnits[2]}</span>
          <span style={allTimeStyles[3]}>{timeInUnits[3]}</span>
          <span className='smallUnit' style={allTimeStyles[3]}>m</span>
          <span style={allTimeStyles[4]} >{timeInUnits[4]}</span>
          <span style={allTimeStyles[5]} >{timeInUnits[5]}</span>
          <span className='typingIndicator' style={{display: (typing) ? "block" : "none"}}>|</span>
          <span className='smallUnit' style={{/*marginRight: "6px"*/}}>s</span>
          <span style={allTimeStyles[6]}>{timeInUnits[6]}</span>
          <span style={allTimeStyles[6]}>{timeInUnits[7]}</span>
        </div>

        {/* Control buttons */}
        <div className='buttonBox'>
          <input type="button" onClick={(!running) ? (start) : (stopTime)} value={(!running) ? "START" : "STOP"} style={{backgroundColor: blueIsh}} />
          <input type="button" onClick={(reset)} value="RESET" style={{backgroundColor: whiteIsh, color: "black"}} />
        </div>

      </div>
      
      {/* Animations */}
      <style>{`
        .timerProgressBox {
          animation: "fill linear reverse forwards";
        }
      `}
      </style>
      <div className='timerProgressBox' style={progressbarStyle /*{visibility: (isTimer) ? "visible" : "hidden"}*/  /*{animationDuration: `${originalTimerTime}s`}*/} ></div>
      <div className='timerOverBox' onClick={stopTimer} style={{visibility: (isTimer && timerOver) ? "visible" : "hidden"}} ></div>
    </div>
  )
}

export default Timer