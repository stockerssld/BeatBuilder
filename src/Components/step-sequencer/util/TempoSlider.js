import React from "react";

import {Slider,TempoSliderSC} from './TempoSliderSC'
const TempoSlider = props => (
  <TempoSliderSC>
    <Slider
      type="range"
      min="30"
      max="300"
      value={props.tempo}
      onChange={e => {
        props.onTempoChange(e.target.value);
      }}
    />
  </TempoSliderSC>
);

export default TempoSlider;
