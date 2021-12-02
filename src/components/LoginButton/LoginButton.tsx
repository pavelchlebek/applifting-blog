import React from 'react';

import { ReactComponent as ArrowSVG } from '../../assets/Arrow.svg';
import classes from './LoginButton.module.css';

type TProps = NoChildren & {
  title: string
  onClick: () => void
}

export const LoginButton: React.FC<TProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick} className={classes.wrapper}>
      <h5 className={classes.text}>{title}</h5>
      <ArrowSVG className={classes.arrow} />
    </div>
  )
}
