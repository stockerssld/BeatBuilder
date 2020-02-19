import styled from 'styled-components'

export const ResetButtonSC=styled.div`
    display: flex;
    height: 60px;
    background: hsl(240, 5%, 22%);
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    color: white;
    align-items: center;
    text-align:center;
    @media (min-width: 900px) {
       width: 60px;
    }
`
export const LabelSpan=styled.span`
    width: 60px;
    margin: auto;
`