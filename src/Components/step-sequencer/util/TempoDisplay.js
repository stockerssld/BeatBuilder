import React from "react";
import {SpamLabel,TempoDisplaySC} from './TempoDisplaySC'
const TempoDisplay = props => (
  <TempoDisplaySC>
    <SpamLabel>{props.tempo}</SpamLabel>
  </TempoDisplaySC>
);

export default TempoDisplay;
