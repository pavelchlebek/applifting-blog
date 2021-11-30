import React from 'react';

import { ReactComponent as MySvg } from '../../assets/Arrow.svg';
import classes from './LoginButton.module.css';

type TProps = NoChildren & {
  title: string
}

export const LoginButton: React.FC<TProps> = ({ title }) => {
  return (
    <div className={classes.wrapper}>
      <h5 className={classes.text}>{title}</h5>
      <MySvg className={classes.arrow} />
    </div>
  )
}
