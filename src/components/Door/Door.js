import React from 'react';

const Door = (props) => {
  const classes = ["door", props.selected ? "selected" : ""].join(" ")

  return (
    <div className={classes} onClick={() => props.onSelect(props.index)}>
      <div>
        {props.content}
      </div>
    </div>
  )
}

export default Door;