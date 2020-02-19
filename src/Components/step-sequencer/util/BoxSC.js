// import styled from 'styled-components'

// export const BoxSC = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: center;
//     align-items: center;
// `
// export const BoxinBox = styled.div`
//     display: block;
//     width: 7vw;
//     height: 7vw;
//     background: hsl(240, 5%, 22%);
//     border-radius: 4px;
//     cursor: pointer;
//     margin: 5px;
//     box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
//     &:hover{
//         background: #787885;
//     }
    
//     &:active{
//         background: #47474f;
//     }
//     &:checked{
//         background: #cbff8b;
//     }
    

// `
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
    root:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box:{
        display: 'block',
        width: '7vw',
        height: '7vw',
        background: 'hsl(240, 5%, 22%)',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '5px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        "&:hover":{
            background: '#787885'
        }
    },
    checked:{
        background: '#cbff8b',
        "&:hover":{
            background: '#f2ffe2'
        }
    },
    active:{
        background: '#47474f'
    },
    activechecked:{
        background: '#e3ffc1'
    }
})