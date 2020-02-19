import styled from 'styled-components'

export const PlayButtonSC= styled.div`
    display: flex;
    height: 60px;
    background: hsl(240, 5%, 22%);
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    color: white;
    @media (max-width: 787px) {  
        width: 100%;
    }

`
export const Label = styled.span`
    margin: auto;
    width: 60px;
    text-align:center;
`