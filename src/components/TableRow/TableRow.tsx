import React from 'react';

import { ReactComponent as EditButton } from '../../assets/edit.svg';
import { ReactComponent as DeleteButton } from '../../assets/trash.svg';
import classes from './TableRow.module.css';

type TProps = NoChildren & {
  title: string
  perex: string
  author: string
  comments: number
  onDelete: () => void
  onEdit: () => void
}

export const TableRow: React.FC<TProps> = ({
  author,
  comments,
  onDelete,
  onEdit,
  perex,
  title,
}) => {
  return (
    <tr className={classes.row}>
      <td>{title}</td>
      <td>{perex}</td>
      <td>{author}</td>
      <td className={classes.commentsCell}>{comments}</td>
      <td>
        <div className={classes.controls}>
          <EditButton className={classes.button} onClick={onEdit} />
          <DeleteButton className={classes.button} onClick={onDelete} />
        </div>
      </td>
    </tr>
  )
}
