import BoxRow from "./BoxRow"
import {StepSequenceSC} from './StepSequenceSC'
import React from 'react'
export default function StepSequence({checked, onToggle, sequenceLength, onPitchSelect, notes, isActive,pitchConversion }){
  
  return( 
    <StepSequenceSC>
      {
        
        notes.map((value, index)=>{
          return(
          <BoxRow
          checked={checked}
          onToggle={onToggle}
          sequenceLength={sequenceLength}
          onPitchSelect={onPitchSelect}
          notes={notes}
          pitchConversion={pitchConversion}
          isActive={isActive}
          row={index}
          key={index}
        />)
        })
      }
    </StepSequenceSC>
  )

}