// import React from "react";
 import BoxRow from "./BoxRow";
 import {StepSequenceSC} from './StepSequenceSC'
// import { Sortable, Card, Icon } from 'zent';
// const StepSequence = props => (
//   <StepSequenceSC>
//     {
//       console.log(props)
//     }
//     {/* <BoxRow
//       checked={props.checked}
//       onToggle={props.onToggle}
//       sequenceLength={props.sequenceLength}
//       onPitchSelect={props.onPitchSelect}
//       notes={props.notes}
//       pitchConversion={props.pitchConversion}
//       isActive={props.isActive}
//       row="0"
//     />
//     <BoxRow
//       checked={props.checked}
//       onToggle={props.onToggle}
//       sequenceLength={props.sequenceLength}
//       onPitchSelect={props.onPitchSelect}
//       notes={props.notes}
//       isActive={props.isActive}
//       row="1"
//     />
//     <BoxRow
//       gle={props.onToggle}
//       sequencechecked={props.checked}
//       onTogLength={props.sequenceLength}
//       onPitchSelect={props.onPitchSelect}
//       notes={props.notes}
//       isActive={props.isActive}
//       row="2"
//     />
//         <div style={{background:"yellow"}}
//           className="demo-sortable-add"
//           onClick={props.handleAdd}>
//           <Icon type="plus" />
//         </div> */}
//   </StepSequenceSC>
// );

// export default StepSequence;
import React from 'react'
export default function StepSequence(props){
  const {notes}=props
  return( 
    <StepSequenceSC>
      {
        notes.map((value, index)=>{
          return(
          <BoxRow
          checked={props.checked}
          onToggle={props.onToggle}
          sequenceLength={props.sequenceLength}
          onPitchSelect={props.onPitchSelect}
          notes={props.notes}
          pitchConversion={props.pitchConversion}
          isActive={props.isActive}
          row={index}
          key={index}
        />)
        })
      }
    </StepSequenceSC>
  )

}