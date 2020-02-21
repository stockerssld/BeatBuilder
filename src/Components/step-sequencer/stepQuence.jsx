import React, { useState, useEffect } from "react"
import _ from "lodash"
import Tone from "tone"
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
// fontawesome library setup
library.add(faPlay);
library.add(faStop);
library.add(faRecycle);
library.add(faInfoCircle);  
export default function StepSequencer(){
    const stateinit={
        checked:[
            [false,false,false,false,false,false], // 0
            [false,false,false,false,false,false]  // 1z
        ],
        isPlaying: false,
        sequenceLength: 7, // length of sequence pattern
        tempo: 120,
        maxTempo: 300,
        isActive:[[0,0,0,0,0,0],[0,0,0,0,0,0]],
        renderedNotes: [],
        partContainer: [], // store Part object for future removal 
        notes:["eb5","C5"],
        timeContainer: [], // tap tempo array
        defaults: {
            tempo: 120,
            sequenceLength: 7,
            isPlaying: false,
            elapsedTime: 0,
            numberOfTaps: 0,
            averageBPM: 0,
            checked: [
                [false,false,false,false,false,false], // 0
                [false,false,false,false,false,false]  // 1z
            ],
            notes:["eb5","C5"],
            isActive:[[0,0,0,0,0,0],[0,0,0,0,0,0]],
        },
        landscape: false,
        velocity: 0.1,        
    }

    const [state, setState]=useState(stateinit)
    const synth = new Tone.PolySynth(2, Tone.Synth).toMaster();
    const context = new AudioContext()


    useEffect(() => {
        generateMetronome();
        StartAudioContext(Tone.context);
        StartAudioContext(context);

        return () => {
            window.addEventListener("keydown", e => {
                if (e.keyCode === 32 || e.keyCode === 13) {
                    try {
                        e.preventDefault()
                        onTogglePlay()
                    } catch (e) {
                    console.log(e)
                    }
                } else if (e.keyCode === 84) {
                    try {
                        e.preventDefault()
                        handleTap();
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
    
            if (window.screen.orientation && 
                Math.abs(window.screen.orientation.angle) === 90 && 
                window.screen.height < 500)
                setState({ ...state, landscape: true })
            window.addEventListener("orientationchange", () => {
                if (Math.abs(window.screen.orientation.angle) !== 90) {
                    setState({ ...state, landscape: false });
                } else if (window.screen.height < 500) {
                    setState({ ...state, landscape: true });
                }
            })
        };
    }, [])


    //Cronometro
    function generateMetronome(){
        const partContainer = state.partContainer
        partContainer.forEach(part => part.removeAll())

        const [note1, note2] = state.notes,
        seqLength = state.sequenceLength,
        matrix = state.checked,
        velocity = state.velocity

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
              }
            /* Cronometro-Tiempos*/ 
              else if (!matrix[1][i]) {
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
            triggerVisualize(value.index);
            synth.triggerAttackRelease(value.note, 0.05, time, value.velocity);
        }, renderedNotes).start(0);
        partContainer.push(part);
    
        setState({...state,
            renderedNotes,
            partContainer
        });
    }

    function triggerVisualize(index){
        const length = state.sequenceLength;
        const isActive = [_.fill(Array(length), 0), _.fill(Array(length), 0)];

        // set particular index as active
        isActive[0][index] = 1;
        isActive[1][index] = 1;
        setState({ ...state, isActive });
    }

    function restartPlaying(){
        if (state.isPlaying) {
            setState({ isPlaying: state.isPlaying });
            () => {
                Tone.Transport.stop();
                Tone.Transport.loopStart = 0;
                Tone.Transport.loopEnd =
                  (state.sequenceLength * 30) / state.tempo;
                Tone.Transport.loop = true;
                Tone.Transport.start("+0.0");
                console.log("playing restarted");
            }
          } else {
            console.error("restartPlaying called while not playing");
          }
    }
    //Play-Stop Toggle
    function onTogglePlay(){
        setState(
            prior => ({...state,
                isPlaying: !prior.isPlaying
            })
        )

        if(state.isPlaying){
            Tone.Transport.stop();
            Tone.Transport.loop = false;
            Tone.Transport.loopEnd = 0;
            setState({...state, isActive: [ [] ] })
            console.log("stopped")
        }else{
            Tone.Transport.loop = true;
            Tone.Transport.loopStart = 0;
            Tone.Transport.loopEnd = (state.sequenceLength * 30) / state.tempo;
            Tone.Transport.start("+0.0");
            console.log("playing");
        }

    
    }

    function onLengthChange(sequenceLength){
        const checked=[ [],[] ]
        for (let i = 0; i < sequenceLength; i++) {
            checked[0].push(i === 0);
            checked[1].push(i !== 0 && i % 2 === 0);
        }
        setState(
            ()=>({...state,
                sequenceLength,
                checked
            })
        )
        
        Tone.Transport.loopEnd = (sequenceLength * 30) / state.tempo;
        generateMetronome()
        
    }

    function onTempoChange(tempo){
        setState(
            {...state, tempo: tempo}
        )
        Tone.Transport.bpm.value = tempo
    }

    function onReset(){
        setState(
            prior=>({
                ...state,
                tempo: prior.defaults.tempo,
                sequenceLength: prior.defaults.sequenceLength,
                isPlaying: prior.defaults.isPlaying,
                checked: prior.defaults.checked,
                notes: prior.defaults.notes,
                isActive: prior.defaults.isActive
            })            
        )
        
        resetTempo();
        forceStop();
        onLengthChange(state.sequenceLength);
        onPitchSelect(state.notes[0], 0);
        onPitchSelect(state.notes[1], 1);
    }

    function forceStop(){
        Tone.Transport.stop();
        Tone.Transport.loop = false;
        Tone.Transport.loopEnd = 0;
        console.log("force stopped");
    }

    function resetTempo(){
        Tone.Transport.bpm.value = state.defaults.tempo;
    }
    function onToggleBox (i, row){
        setState(
            prior => ({
              ...state,checked: toggleBox(prior.checked, i, row)
            })
        )
        generateMetronome();
        
    }

    function toggleBox(priorChecked, i, row){
        const checked = [...priorChecked];
        checked[row][i] = !checked[row][i];
        return checked;
    }

    function onPitchSelect (note, row){
        setState(
            {...state,
              notes:
                row === "0"
                  ? [note, state.notes[1]]
                  : [state.notes[0], note]
            }
          )
          generateMetronome();
    }


    function handleTap(){
        // timeContainer maintenance - shift and push
        const timeContainer = state.timeContainer;
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
        if (tempo > 40 && tempo < 301) {
          setState({...state, tempo }, () => onTempoChange(tempo));
        } else if (tempo > 300) {
          setState({...state, tempo: state.maxTempo }, () =>
            onTempoChange(state.tempo)
          );
        }
      };

      
    return(
        <>
        <Buttons
            isPlaying={state.isPlaying}
            onTogglePlay={onTogglePlay}
            sequenceLength={state.sequenceLength}
            onLengthChange={onLengthChange}
            tempo={state.tempo}
            onTempoChange={onTempoChange}
            onReset={onReset}
            
          />
        
        {JSON.stringify(state)}
        <StepSequence
            checked={state.checked}
            onToggle={onToggleBox}
            sequenceLength={state.sequenceLength}
            onPitchSelect={onPitchSelect}
            notes={state.notes}
            isActive={state.isActive}
          />
        </>
    )
}