import React from 'react';

const Button = (props) => (
  <button
    disabled={props.disabled}
    className={["btn", props.btnType].join(" ")}
    onClick={props.clicked}
    type={props.type}>
    {props.children}

  </button>
)

export default Button;