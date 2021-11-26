import React from 'react';

import classes from './Button.module.css';

type TProps = NoChildren & {
  title: string
  color: "primary" | "secondary"
  onClick: () => void
  style?: React.CSSProperties
}

export const Button: React.FC<TProps> = ({ title, onClick, color, style }) => {
  let attachedClasses = classes.button
  if (color === "primary") {
    attachedClasses = [classes.button, classes.primary].join(" ")
  }
  if (color === "secondary") {
    attachedClasses = [classes.button, classes.secondary].join(" ")
  }

  return (
    <div style={style} className={attachedClasses} onClick={onClick}>
      {title}
    </div>
  )
}
