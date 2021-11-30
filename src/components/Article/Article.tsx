import React from 'react';

import axios from 'axios';

import { API } from '../../api';
import classes from './Article.module.css';

type TProps = NoChildren & {
  imageId: string
  title: string
  author: string
  published: Date
  perex: string
  // comments: number
  onClick: () => void
}

const headers = {
  "X-API-KEY": "ba113e43-e68f-4afb-bad5-e73551f3f06f",
  Authorization: "14ca9347-62d7-41b9-a087-10b916cf6bbe",
}

export const Article: React.FC<TProps> = ({
  author,
  // comments,
  imageId,
  perex,
  published,
  title,
  onClick,
}) => {
  const [source, setSource] = React.useState("")

  React.useEffect(() => {
    const getPicture = async () => {
      try {
        const response = await axios.get(`${API.server}${API.endpoints.IMAGES}/${imageId}`, {
          headers: headers,
          responseType: "blob",
        })
        const imageString = response.data
        const reader = new FileReader()
        reader.readAsDataURL(imageString)
        reader.onload = () => {
          const imageDataUrl = reader.result
          if (typeof imageDataUrl === "string") {
            setSource(imageDataUrl)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
    getPicture()
  }, [imageId])

  const getFormattedDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear().toString().slice(2, 4)
    return `${month}/${day}/${year}`
  }

  return (
    <div className={classes.container}>
      <img className={classes.picture} src={source} alt={title} />
      <div className={classes.textInfo}>
        <h2 className={classes.heading}>{title}</h2>
        <div className={classes.secondaryInfo}>
          <h4 className={classes.author}>{author}</h4>
          <div className={classes.dot}></div>
          <h4 className={classes.date}>{getFormattedDate(published)}</h4>
        </div>
        <p className={classes.perex}>{perex}</p>

        <h5 onClick={onClick} className={classes.link}>
          Read whole article
        </h5>
        {/* <h5 className={classes.comments}>{`${comments} comments `}</h5> */}
      </div>
    </div>
  )
}
