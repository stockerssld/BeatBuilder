import styled from 'styled-components'
export const TempoDisplaySC = styled.div`
    display: flex;
    height: 60px;
    background: hsl(240, 5%, 22%);
    border-radius: 4px;
    margin: 5px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    color: white;
    align-items: center;

    @media (min-width: 900px) {
        font-size: 22px;
    }

`

export const SpamLabel= styled.span`
    margin: auto;
    font-family: "Orbitron", sans-serif;
    font-size: 18px;
    width: 60px;
    /* Disables text selection on on span */
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
`
