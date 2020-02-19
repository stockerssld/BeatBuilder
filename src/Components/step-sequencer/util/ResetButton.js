import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {LabelSpan,ResetButtonSC} from './ResetButtonSC'
const ResetButton = props => (
  <ResetButtonSC onClick={props.onReset}>
    <LabelSpan>
      <FontAwesomeIcon icon="recycle" />
    </LabelSpan>
  </ResetButtonSC>
);

export default ResetButton;
