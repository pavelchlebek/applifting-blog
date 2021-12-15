import React from 'react';

import classes from './Overlay.module.css';

type TProps = NoChildren & {
  show: boolean
  onClick: () => void
}

export const Overlay: React.FC<TProps> = ({ onClick, show }) =>
  show ? <div className={classes.overlay} onClick={onClick}></div> : null
