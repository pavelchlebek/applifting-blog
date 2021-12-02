import React from 'react';

import { Toolbar } from '../Toolbar/Toolbar';
import classes from './Screen.module.css';

type TProps = React.PropsWithChildren<{
  children: React.ReactNode
}>

export const Screen: React.FC<TProps> = ({ children }) => {
  return (
    <div className={classes.screen}>
      <div className={classes.container}>
        <Toolbar loggedIn={true} />
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  )
}
