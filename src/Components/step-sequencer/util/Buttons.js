import React from "react";
import PlayButton from "./PlayButton";
import TimeSignature from "./TimeSignature";
import TempoSlider from "./TempoSlider";
import TempoDisplay from "./TempoDisplay";
import TapTempo from "./TapTempo";
import ResetButton from "./ResetButton";
import {ButtonSC, Wrapper} from './ButttonsSC'
const Buttons = props => (
  <ButtonSC id="buttons">
    <Wrapper>
      <PlayButton
        isPlaying={props.isPlaying}
        onTogglePlay={props.onTogglePlay}
      />
      <TimeSignature
        sequenceLength={props.sequenceLength}
        onLengthChange={props.onLengthChange}
      />
      <ResetButton onReset={props.onReset} />
    </Wrapper>

    <Wrapper>
      <TapTempo handleTap={props.handleTap} />
      <TempoDisplay tempo={props.tempo} />
      <TempoSlider tempo={props.tempo} onTempoChange={props.onTempoChange} />
    </Wrapper>
  </ButtonSC>
);

export default Buttons;
