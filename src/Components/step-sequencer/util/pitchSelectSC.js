import styled from 'styled-components'

export const PitchSelectSC=styled.div`
    display: flex;
    background: hsl(240, 5%, 22%);
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    color: white;
    align-items: center;

    @media (max-width: 768px) {
        display: none;
    }
`
export const Selects = styled.select`
    margin: 5px;
    outline: none;
    background: #36363c;
    color: white;
    padding: 1em;
    font-size: 18px;
    letter-spacing: 1px;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border: 2px solid transparent;
    font-family: "Orbitron", sans-serif;
    font-size: 14px;
    -webkit-appearance: none;
    -moz-appearance: none;
`