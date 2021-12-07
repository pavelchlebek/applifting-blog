import React from 'react';

import { ReactComponent as ChevronDown } from '../../assets/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../assets/chevron-up.svg';
import {
  IComment,
} from '../../screens/ArticleDetailScreen/ArticleDetailScreen';
import classes from './Comment.module.css';

type TProps = NoChildren & {
  comment: IComment
  onVoteUp: () => void
  onVoteDown: () => void
}

export const Comment: React.FC<TProps> = ({ comment, onVoteUp, onVoteDown }) => {
  const getTimeAgo = (dateString: string) => {
    return "2 hours ago"
  }

  const formatScore = (score: number) => {
    if (score > 0) {
      return `+${score}`
    }
    return score
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h4 className={classes.author}>{comment.author}</h4>
        <h4 className={classes.when}>{getTimeAgo(comment.createdAt)}</h4>
      </div>
      <p className={classes.content}>{comment.content}</p>
      <div className={classes.scoreContainer}>
        <h6 className={classes.score}>{formatScore(comment.score)}</h6>
        <div onClick={onVoteUp} className={classes.upContainer}>
          <ChevronUp className={classes.control} />
        </div>
        <div onClick={onVoteDown} className={classes.downContainer}>
          <ChevronDown className={classes.control} />
        </div>
      </div>
    </div>
  )
}
