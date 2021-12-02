import React from 'react';

import classes from './ArticleShort.module.css';

type TProps = NoChildren & {
  title: string
  perex: string
  onClick: () => void
}

export const ArticleShort: React.FC<TProps> = ({ perex, title, onClick }) => {
  return (
    <div className={classes.article}>
      <h5 onClick={onClick} className={classes.title}>
        {title}
      </h5>
      <p className={classes.perex}>{`${perex.slice(0, 180)}...`}</p>
    </div>
  )
}
