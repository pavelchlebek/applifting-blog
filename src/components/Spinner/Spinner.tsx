import React from 'react';

import classes from './Spinner.module.css';

type TProps = NoChildren

export const Spinner: React.FC<TProps> = () => {
  return <div className={classes.loader}>Loading...</div>
}
