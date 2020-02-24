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

const guardar = [];
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
    isActive: [
      [0, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0]
    ], // used for highlighting suring visualization
    renderedNotes: [],
    partContainer: [], // store Part object for future removal
    notes: ["Eb5", "C5"],
    timeContainer: [], // tap tempo array
    defaults: {
      tempo: 120,
      sequenceLength: 7,
      isPlaying: false,
      elapsedTime: 0,
      numberOfTaps: 0,
      averageBPM: 0,
      checked: [
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false]
      ],
      notes: ["Eb5", "C5"],
      isActive: [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1]
      ]
    },
    landscape: false,
    velocity: 0.1
  };

  handleSubmit = async e => {
    e.preventDefault();
    console.log(this.state);
    // const url="localhost"
    // await fetch(url/sounds,
    //   {
    //     method: 'POST',
    //     headers:{
    //       'Accept': 'applicaton/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body:
    //       JSON.stringify({
    //         sounds:{
    //           this.state
    //         }
    //       })

    //   })
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
          e.preventDefault();
          this.onTogglePlay();
        } catch (e) {
          console.log(e);
        }
      } else if (e.keyCode === 84) {
        try {
          e.preventDefault();
          this.handleTap();
        } catch (e) {
          console.log(e);
        }
      }
    });

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
    const actived = [], activexd = this.state.isActive;

    activexd.map(()=>{
      actived.push([])
    })

    this.setState(
      prior => ({
        isPlaying: !prior.isPlaying
      }),
      () => {
        if (!this.state.isPlaying) {
          Tone.Transport.stop();
          Tone.Transport.loop = false;
          Tone.Transport.loopEnd = 0;
          this.setState({ isActive: actived }, () => console.log("stopped"));
        } else {
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
    
    const checked = [], checkedx = this.state.checked;

    checkedx.map(()=>{
      checked.push([])
    })

    for (let j = 0;  j< this.state.notes.length; j++) {
      for (let i = 0; i < sequenceLength; i++) {
        if (this.state.checked[j][i]) {
        checked[j].push(i === 0);
        } else if (!this.state.checked[j][i]) {
          checked[j].push(i !== 0 && i % 2 === 0);
        }
      // 
      }
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

    const timeContainer = this.state.timeContainer;
    if (timeContainer.length > 2) timeContainer.shift();
    timeContainer.push(context.currentTime.toFixed(3));

    const tempo = Math.round(
      60 /
        (timeContainer
          .slice(1)
          .map((time, i) => time - timeContainer[i])
          .reduce((a, b) => a + b, 0) /
          (timeContainer.length - 1))
    );

    if (tempo > 40 && tempo < 301) {
      this.setState({ tempo }, () => this.onTempoChange(tempo));
    } else if (tempo > 300) {
      this.setState({ tempo: this.state.maxTempo }, () =>
        this.onTempoChange(this.state.tempo)
      );
    }
  };

  onPitchSelect = (note, row) => {
    const element = [];

    for (let i = 0; i < this.state.notes.length; i++) {
      for (let j = 0; j < this.state.checked.length; j++) {
        element.push(i, j)
      }      
    }
    console.log(element)
    this.setState(
      {
        notes: [element]
      },
      () => {
        this.generateMetronome();
      }
    );
  };

  generateMetronome = () => {

    const partContainer = this.state.partContainer;
    partContainer.forEach(part => part.removeAll());

    const seqLength = this.state.sequenceLength,
      matrix = this.state.checked,
      velocity = this.state.velocity;


    const renderedNotes = [];
    for (let allnote = 0; allnote < this.state.notes.length; allnote++) {
      for (let i = 0; i < seqLength; i++) {
        const time = i / 2;
        if (matrix[allnote][i]) {
          renderedNotes.push({
            note: this.state.notes[allnote],
            time: `0:${time}`,
            velocity: velocity,
            index: i
          });
        } else if (!matrix[allnote][i]) {
          renderedNotes.push({
            note: this.state.notes[allnote],
            time: `0:${time}`,
            velocity: 0,
            index: i
          });
        }
      }
    }
  

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
    const length = this.state.sequenceLength, actived=this.state.isActive.length, isActive = [];
    
    
    for (let i = 0; i < actived; i++) {
      isActive.push([_.fill(Array(length), 0)])
    }
   
    for (let i = 0; i < this.state.isActive.length; i++) {
      isActive[i][index] = 1;
    }
    this.setState({ isActive });
  };

  handleAdd = e => {
    e.preventDefault();
    let array = [[], []];

    const tone = this.state.sequenceLength ? this.state.sequenceLength : [];

    for (let length = 0; length < tone; length++) {
      array[0].push(false);
      array[1].push(0);
    }

    let check = { checked: array[0] };
    let active = { isActive: array[1] };
    let newNote = { notes: "A4" };
    const status = [
      this.state.notes.concat([newNote.notes]),
      this.state.isActive.concat([active.isActive]),
      this.state.checked.concat([check.checked])
    ];
    this.setState({
      notes: status[0],
      isActive: status[1],
      checked: status[2]
    });
  };

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

          <button onClick={this.handleAdd.bind(this)}>Agregar</button>
          <form onSubmit={this.handleSubmit}>
            <button type="submit">Create</button>
          </form>
        </header>
      </div>
    );
  }
}
