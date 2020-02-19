import styled from 'styled-components'

export const TimeSignoreSC=styled.div`
    display: flex;
    max-width: 70px;
    height: 60px;
    background: hsl(240, 5%, 22%);
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    color: white;
    align-items: center;
    text-align-last:center;
`

export const LengthSelect= styled.select`
    margin: 5px;
    outline: none;
    height: 60px;
    background: transparent;
    color: white;
    padding: 1em;
    font-size: 18px;
    letter-spacing: 1px;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border: 2px solid transparent;
    font-family: "Orbitron", sans-serif;
    -webkit-appearance: none;
    -moz-appearance: none;
`