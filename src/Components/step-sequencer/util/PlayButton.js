import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {PlayButtonSC, Label} from './PlayButtonSC'
const PlayButton = props => (
  <PlayButtonSC onClick={props.onTogglePlay}>
    <Label>
      {props.isPlaying ? (
        <FontAwesomeIcon icon="stop" />
      ) : (
        <FontAwesomeIcon icon="play" />
      )}
    </Label>
  </PlayButtonSC>
);

export default PlayButton;
