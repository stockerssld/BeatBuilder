import styled from 'styled-components'

export const ButtonSC = styled.div`
    padding: 1em 0.5em;
    background: #28282c;
    border-radius: 4px;
    display: flex;
    margin-bottom: 1%;
    justify-content: space-between;
    @media (max-width: 640px) {
        .root {
            display: grid;
        }
    }

`
export const  Wrapper = styled.div`
    display: inline-flex;
`