import StepSequencer from './../Components/step-sequencer/index'
import React from 'react'

export default function app(){
    return(
      <>
        {/* <input onChange={tick.play()} type="range" min="0" max="100" step="5" type="range" value="10"/> */}
        <StepSequencer/>
      </>
    )
}