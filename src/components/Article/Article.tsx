import React from 'react';

import classes from './Article.module.css';

type TProps = NoChildren & {
  imageUrl: string
  title: string
  author: string
  published: Date
  perex: string
  comments: number
}

export const Article: React.FC<TProps> = ({
  author,
  comments,
  imageUrl,
  perex,
  published,
  title,
}) => {
  return (
    <div className={classes.container}>
      <img className={classes.picture} src={imageUrl} alt={title} />
      <div className={classes.textInfo}>
        <h2 className={classes.heading}>{title}</h2>
        <div className={classes.secondaryInfo}>
          <h4 className={classes.author}>{author}</h4>
          <div className={classes.dot}></div>
          <h4 className={classes.date}>{published.toISOString()}</h4>
        </div>
        <p className={classes.perex}>{perex}</p>
      </div>
    </div>
  )
}
