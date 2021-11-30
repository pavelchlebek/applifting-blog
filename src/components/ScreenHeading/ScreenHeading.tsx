import React from 'react';

import classes from './ScreenHeading.module.css';

type TProps = NoChildren & {
  title: string
}

export const ScreenHeading: React.FC<TProps> = ({ title }) => {
  return <h2 className={classes.heading}>{title}</h2>
}
