import React from 'react';

const Door = (props) => {
  return (
    <div className="door" onClick={() => props.onSelect(props.index)}>
      <div>
        {props.content}
      </div>
    </div>
  )
}

export default Door;