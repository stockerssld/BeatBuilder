import React from "react";
import Tone from "tone";
import _ from "lodash";
import Buttons from "./util/Buttons";
import StepSequence from "./util/StepSequence";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faStop,
  faRecycle,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import StartAudioContext from "startaudiocontext";

/**
 TODO
 - Visualizer - must clear on stop, sometimes gets stuck on highlighted checked square
 - Tooltips for Play and Tap buttons 
 */

function toggleBox(priorChecked, i, row) {
  const checked = [...priorChecked];
  checked[row][i] = !checked[row][i];
  return checked;
}

// what are correct places for these?
// creates a global synth and context
const synth = new Tone.PolySynth(2, Tone.Synth).toMaster();
const context = new AudioContext();

// fontawesome library setup
library.add(faPlay);
library.add(faStop);
library.add(faRecycle);
library.add(faInfoCircle);

const guardar=[]
export default class StepSequencer extends React.PureComponent {
  
  state = {
    checked: [
      [true, true, false, false, false, false, false],
      [false, false, true, false, true, false, true]
    ], // sequencer pattern array
    isPlaying: false,
    sequenceLength: 7, // length of sequence pattern
    tempo: 120,
    maxTempo: 300,
    isActive: [[0, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0]], // used for highlighting suring visualization
    renderedNotes: [],
    partContainer: [], // store Part object for future removal
    notes: ["Eb5", "C5"],
    timeContainer: [], // tap tempo array
    // defaults: {
    //   tempo: 120,
    //   sequenceLength: 7,
    //   isPlaying: false,
    //   elapsedTime: 0,
    //   numberOfTaps: 0,
    //   averageBPM: 0,
    //   checked: [
    //     [false, false, false, false, false, false, false, false],
    //     [false, false, false, false, false, false, false, false]
    //   ],
    //   notes: ["Eb5", "C5"],
    //   isActive: [[0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, 0, 1, 0, 1]]
    // },
    landscape: false,
    velocity: 0.1
  };

  componentDidMount = () => {
    this.generateMetronome();

    // starts both audio contexts on mounting
    StartAudioContext(Tone.context);
    StartAudioContext(context);

    // event listener for space, enter and 't'
    window.addEventListener("keydown", e => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        try {
          e.preventDefault(); // prevents space bar from triggering selected checkboxes
          this.onTogglePlay();
        } catch (e) {
          console.log(e);
        }
      } else if (e.keyCode === 84) {
        try {
          e.preventDefault(); // prevents space bar from triggering selected checkboxes
          this.handleTap();
        } catch (e) {
          console.log(e);
        }
      }
    });

    // check for orientation, add event listener
    if (
      window.screen.orientation &&
      Math.abs(window.screen.orientation.angle) === 90 &&
      window.screen.height < 500
    )
      this.setState({ landscape: true });
    window.addEventListener("orientationchange", () => {
      if (Math.abs(window.screen.orientation.angle) !== 90) {
        this.setState({ landscape: false });
      } else if (window.screen.height < 500) {
        this.setState({ landscape: true });
      }
    });
  };

  onToggleBox = (i, row) => {
    this.setState(
      prior => ({
        checked: toggleBox(prior.checked, i, row)
      }),
      () => {
        this.generateMetronome();
      }
    );
  };

  onTogglePlay = () => {
    this.setState(
      prior => ({
        isPlaying: !prior.isPlaying
      }),
      () => {
        if (!this.state.isPlaying) {
          //stop transport, turn off looping - prevents collision with measure sequence loop
          Tone.Transport.stop();
          Tone.Transport.loop = false;
          Tone.Transport.loopEnd = 0;
          // isActive array zeroed out
          this.setState({ isActive: [[], []] }, () => console.log("stopped"));
        } else {
          // configure looping for step sequencer
          Tone.Transport.loop = true;
          Tone.Transport.loopStart = 0;
          Tone.Transport.loopEnd =
            (this.state.sequenceLength * 30) / this.state.tempo;
          Tone.Transport.start("+0.0");
          console.log("playing");
        }
      }
    );
  };

  restartPlaying = () => {
    if (this.state.isPlaying) {
      this.setState({ isPlaying: this.state.isPlaying }, () => {
        Tone.Transport.stop();
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd =
          (this.state.sequenceLength * 30) / this.state.tempo;
        Tone.Transport.loop = true;
        Tone.Transport.start("+0.0");
        console.log("playing restarted");
      });
    } else {
      console.error("restartPlaying called while not playing");
    }
  };

  onLengthChange = sequenceLength => {
    // create a new checked array and push simple everyother note pattern
    const checked = [[], []];
    for (let i = 0; i < sequenceLength; i++) {
      checked[0].push(i === 0);
      checked[1].push(i !== 0 && i % 2 === 0);
    }
    this.setState(
      () => ({
        sequenceLength,
        checked
      }),
      () => {
        Tone.Transport.loopEnd = (sequenceLength * 30) / this.state.tempo;
        this.generateMetronome();
      }
    );
  };

  onTempoChange = tempo => {
    this.setState(
      {
        tempo
      },
      () => {
        Tone.Transport.bpm.value = tempo;
      }
    );
  };

  onReset = () => {
    this.setState(
      prior => ({
        tempo: prior.defaults.tempo,
        sequenceLength: prior.defaults.sequenceLength,
        isPlaying: prior.defaults.isPlaying,
        checked: prior.defaults.checked,
        notes: prior.defaults.notes,
        isActive: prior.defaults.isActive
      }),
      () => {
        this.resetTempo();
        this.forceStop();
        this.onLengthChange(this.state.sequenceLength);
        this.onPitchSelect(this.state.notes[0], 0);
        this.onPitchSelect(this.state.notes[1], 1);
      }
    );
  };

  forceStop = () => {
    Tone.Transport.stop();
    Tone.Transport.loop = false;
    Tone.Transport.loopEnd = 0;
    console.log("force stopped");
  };

  resetTempo = () => {
    Tone.Transport.bpm.value = this.state.defaults.tempo;
  };

  handleTap = () => {
    // timeContainer maintenance - shift and push
    const timeContainer = this.state.timeContainer;
    if (timeContainer.length > 2) timeContainer.shift();
    timeContainer.push(context.currentTime.toFixed(3));

    // calculate tempo
    const tempo = Math.round(
      60 /
        (timeContainer
          .slice(1)
          .map((time, i) => time - timeContainer[i])
          .reduce((a, b) => a + b, 0) /
          (timeContainer.length - 1))
    );

    // make sure tempo is within acceptable bounds
    if (tempo > 40 && tempo < 301) {
      this.setState({ tempo }, () => this.onTempoChange(tempo));
    } else if (tempo > 300) {
      this.setState({ tempo: this.state.maxTempo }, () =>
        this.onTempoChange(this.state.tempo)
      );
    }
  };

  onPitchSelect = (note, row) => {
    this.setState(
      {
        notes:
          row === "0" // refactor this conditional
            ? [note, this.state.notes[1]]
            : [this.state.notes[0], note]
      },
      () => {
        this.generateMetronome();
      }
    );
  };

  generateMetronome = () => {
    // erase or stop all previous parts
    const partContainer = this.state.partContainer;
    partContainer.forEach(part => part.removeAll());

    // metronome vitals
    const [note1, note2] = this.state.notes,
      seqLength = this.state.sequenceLength,
      matrix = this.state.checked,
      velocity = this.state.velocity;

    // new renderedNotes array, populate
    const renderedNotes = [];
    for (let i = 0; i < seqLength; i++) {
      const time = i / 2;
      if (matrix[0][i]) {
        renderedNotes.push({
          note: note1,
          time: `0:${time}`,
          velocity: velocity,
          index: i
        });
      } else if (!matrix[1][i]) {
        renderedNotes.push({
          note: note1,
          time: `0:${time}`,
          velocity: 0,
          index: i
        });
      }
      if (matrix[1][i]) {
        renderedNotes.push({
          note: note2,
          time: `0:${time}`,
          velocity: velocity,
          index: i
        });
      }
    }

    // create new Part, start Part, push Part to container
    const part = new Tone.Part((time, value) => {
      this.triggerVisualize(value.index);
      synth.triggerAttackRelease(value.note, 0.05, time, value.velocity);
    }, renderedNotes).start(0);
    partContainer.push(part);

    this.setState({
      renderedNotes,
      partContainer
    });
  };

  triggerVisualize = index => {
    // generate array of 0's
    const length = this.state.sequenceLength;
    const isActive = [_.fill(Array(length), 0), _.fill(Array(length), 0)];

    // set particular index as active
    isActive[0][index] = 1;
    isActive[1][index] = 1;
    this.setState({ isActive });
  };

  handleAdd=()=>{
    
  }
  handleRemove=(removeIndex)=>{
    
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
         
          <Buttons
            isPlaying={this.state.isPlaying}
            onTogglePlay={this.onTogglePlay}
            sequenceLength={this.state.sequenceLength}
            onLengthChange={this.onLengthChange}
            tempo={this.state.tempo}
            onTempoChange={this.onTempoChange}
            onReset={this.onReset}
            handleTap={this.handleTap}
          />
          <StepSequence
            checked={this.state.checked}
            onToggle={this.onToggleBox}
            sequenceLength={this.state.sequenceLength}
            onPitchSelect={this.onPitchSelect}
            notes={this.state.notes}
            isActive={this.state.isActive}
          />
        </header>
      </div>
    );
  }
}
