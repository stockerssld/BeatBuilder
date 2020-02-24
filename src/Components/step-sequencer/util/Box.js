import React from "react";
import _ from "lodash";
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles({
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



function Box (props){
  const classes = useStyles();

  // console.warn(props)
  return(
  <div className={classes.root}>
    {_.map(props.checked[props.row], (isBoxChecked, i) => (
      <div
        onClick={() => {
          props.onToggle(i, props.row);
        }}
        className={_.chain([
          classes.box,
          isBoxChecked && classes.checked,
          props.isActive[props.row][i] && !isBoxChecked && classes.active,
          props.isActive[props.row][i] && isBoxChecked && classes.activechecked
        ])
          .compact()
          .join(" ")
          .value()}
        key={i}
      />
    ))} 
  </div>
  )
}

export default Box;
