import UIfx from 'uifx'
import tickMp3 from './../temps/music/A1.mp3'
import React from 'react'
const tick = new UIfx(
  tickMp3,
  {
    volume: 0.9, // value must be between 0.0 ⇔ 1.0
    throttleMs: 50
  }
)

// temporarily change volume
tick.play(0.5)                   // plays 0.5 volume
tick.play()                      // reverts back to 0.1 volume

// permanently change volume
tick.setVolume(0.2).play()       // plays 0.2 volume
tick.play()                      // plays 0.2 volume
export default function app(){
    return(
        <input onChange={tick.play()} type="range" min="0" max="100" step="5" type="range" value="10"/>
        
    )
}