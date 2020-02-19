import React from "react";
import {SpamLabel,TapTempoSC} from './TapTempoSC'
const TapTempo = props => (
  <TapTempoSC onClick={props.handleTap}>
    <SpamLabel >Tap</SpamLabel>
  </TapTempoSC>
);

export default TapTempo;
