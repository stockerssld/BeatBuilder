import React from "react";
import PitchSelect from "./PitchSelect";
import Box from "./Box";
import {BoxRowSC} from './BoxRowSC'

const BoxRow = props => (
  <BoxRowSC>
    <PitchSelect
      onPitchSelect={props.onPitchSelect}
      notes={props.notes}
      row={props.row}
    />
    <Box
      checked={props.checked}
      row={props.row}
      isActive={props.isActive}
      onToggle={props.onToggle}
    />
  </BoxRowSC>
);

export default BoxRow;
