import React, {useState, useEffect,useRef } from 'react'
import {Sampler} from 'tone'
import A1 from "./../A2.mp3"
import UIfx from "uifx"

const tick = new UIfx({
    asset: A1,
    throttleMs: 40
});

export default function index(){

    const [isLoaded, setLoaded]= useState(false)
    const sound = new UIfx({ asset: A1 });
    const [valueSound, setValueSound]=useState(0)
    const synth = new Tone.MetalSynth().toMaster()

    const sampler = useRef(null)

    useEffect(() => {
        sampler.current = new Sampler(
            {A1},
            {
                onload:()=>{
                    setLoaded(true)
                }
            }
        ).toMaster()
    }, [])

    const handleClick=()=> sampler.current.triggerAttack("A1")

    const volume=(e)=>{
        setValueSound(e.target.valueSound)
        tick.setVolume(valueSound)
        tick.play(valueSound);
        console.log("sound", A1);
    }
    
    return(
        <div>
            {/* <div>{valueSound}</div>
            <input type="range" value={valueSound} onChange={volume} /> */}
            <button disabled={!isLoaded} onClick={handleClick}>   
                {isLoaded?'start':'stop'}
            </button> 
        </div>
    )
}