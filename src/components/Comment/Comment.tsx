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

const secondsInHour = 3600
const millisecondsInSecond = 1000
const secondsInMinute = 60
const hoursInDay = 24
const daysInWeek = 7
const daysInMonth = 30 // approximation -- later in getTimeAgo function we round anyway
const monthsInYear = 12

export const Comment: React.FC<TProps> = ({ comment, onVoteUp, onVoteDown }) => {
  // can be put to utility file, in this particular app the function is used only in Comment component, so we leave it here
  const getTimeAgo = (dateString: string) => {
    // adding one hour to match local time
    const timestamp = new Date(dateString).getTime() + secondsInHour * millisecondsInSecond
    // counting seconds elapsed till now
    const secondsAgo = Math.round((Date.now() - timestamp) / 1000)

    if (secondsAgo < secondsInMinute) {
      return `${secondsAgo} seconds ago` // further we can take care of singular and plural
    }
    if (secondsAgo < secondsInHour) {
      return `${Math.round(secondsAgo / secondsInMinute)} minutes ago`
    }
    if (secondsAgo < secondsInHour * hoursInDay) {
      return `${Math.round(secondsAgo / secondsInHour)} hours ago`
    }
    if (secondsAgo < hoursInDay * secondsInHour * daysInWeek) {
      return `${Math.round(secondsAgo / (hoursInDay * secondsInHour))} days ago`
    }
    if (secondsAgo < daysInMonth * hoursInDay * secondsInHour) {
      return `${Math.round(secondsAgo / (daysInWeek * hoursInDay * secondsInHour))} weeks ago`
    }
    if (secondsAgo < monthsInYear * daysInMonth * hoursInDay * secondsInHour) {
      return `${Math.round(secondsAgo / (daysInMonth * hoursInDay * secondsAgo))} months ago`
    }
    return `${Math.round(
      secondsAgo / (monthsInYear * daysInMonth * hoursInDay * secondsInHour)
    )} years ago`
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
