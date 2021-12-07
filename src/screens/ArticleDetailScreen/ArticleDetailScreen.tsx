import React from 'react';

import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  useNavigate,
  useParams,
} from 'react-router';

import { API } from '../../api';
import { ArticleShort } from '../../components/ArticleShort/ArticleShort';
import { Comment } from '../../components/Comment/Comment';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import {
  IArticlesResponse,
  IArticleWithImageId,
} from '../ArticlesScreen/ArticlesScreen';
import classes from './ArticleDetailScreen.module.css';

type TProps = NoChildren
export interface IComment {
  commentId: string
  author: string
  content: string
  createdAt: string
  score: number
}

interface IArticleDetail extends IArticleWithImageId {
  content: string
  comments: IComment[]
}

const headers = {
  "X-API-KEY": "ba113e43-e68f-4afb-bad5-e73551f3f06f",
  // Authorization: "Bearer 24fa0512-18a9-4d4e-a980-a28b06ce4753",
}

export const ArticleDetailScreen: React.FC<TProps> = () => {
  const params = useParams()
  const navigate = useNavigate()
  const articleId = params.articleId

  const [articleDetail, setArticleDetail] = React.useState<IArticleDetail>()
  const [imageSource, setImageSource] = React.useState("")
  const [relatedArticles, setRelatedArticles] = React.useState<IArticleWithImageId[]>([])

  /**
   * fetching all article information
   * once we have article details, we fetch and read picture file using imageId
   * once we have downloaded "blob" (the picture) we read it as DataURL, which gives us string to feed the img src attribute
   */
  React.useEffect(() => {
    const getPicture = async (imageId: string) => {
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
            setImageSource(imageDataUrl)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
    const getArticle = async () => {
      try {
        const response = await axios.get<IArticleDetail>(
          `${API.server}${API.endpoints.ARTICLES}/${articleId}`,
          {
            headers: headers,
          }
        )
        getPicture(response.data.imageId)
        setArticleDetail(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    getArticle()
  }, [articleId])

  /**
   * fetching all the articles, then filtering currently displayed article
   * providing filtered articles to "Related article section"
   */
  React.useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get<IArticlesResponse>(
          `${API.server}${API.endpoints.ARTICLES}`,
          {
            headers: headers,
          }
        )
        // filtering currently displayed article
        const filteredArticles = response.data.items.filter(
          (article) => article.articleId !== articleId
        )
        setRelatedArticles(filteredArticles)
      } catch (err) {
        console.log(err)
      }
    }

    getArticles()
  }, [articleId])

  const goToArticle = (articleId: string) => {
    const detailUrl = `/article-detail/${articleId}`
    navigate(detailUrl)
  }

  const getFormattedDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear().toString()
    return `${month}.${day}.${year}`
  }

  /**
   * comments voting functionality
   */
  const voteUp = async (commentId: string) => {
    try {
      const response = await axios.post<IComment>(
        `${API.server}${API.endpoints.COMMENTS}/${commentId}/vote/up`,
        null,
        {
          headers: headers,
        }
      )
      // updating score for given comment
      console.log("updatedScore: ", response.data.score)
    } catch (err) {
      console.log("votingUp error: ", err)
    }
  }

  const voteDown = async (commentId: string) => {
    try {
      const response = await axios.post<IComment>(
        `${API.server}${API.endpoints.COMMENTS}/${commentId}/vote/down`,
        null,
        {
          headers: headers,
        }
      )
      console.log("updatedScore: ", response.data.score)
    } catch (err) {
      console.log("votingUp error: ", err)
    }
  }

  return (
    <div className={classes.page}>
      {articleDetail && (
        <div className={classes.left}>
          <ScreenHeading title={articleDetail.title} />
          <div className={classes.headerInfo}>
            <h4 className={classes.author}>Palkin Palisander</h4>
            <div className={classes.dot}></div>
            <h4 className={classes.date}>
              {getFormattedDate(new Date(articleDetail.lastUpdatedAt))}
            </h4>
          </div>
          {imageSource ? (
            <img className={classes.image} src={imageSource} alt="Dog or cat" />
          ) : (
            <h6>loading...</h6>
          )}
          <ReactMarkdown className={classes.markdown}>{articleDetail.content}</ReactMarkdown>
          <div className={classes.comments}>
            <h4
              className={classes.smallerHeading}
            >{`Comments (${articleDetail.comments.length})`}</h4>
            {articleDetail.comments.length > 0 && (
              <div>
                {articleDetail.comments.map((comment) => {
                  return (
                    <Comment
                      key={comment.commentId}
                      comment={comment}
                      onVoteUp={() => voteUp(comment.commentId)}
                      onVoteDown={() => voteDown(comment.commentId)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={classes.right}>
        <h4 className={classes.smallerHeading + " " + classes.headingRight}>Related articles</h4>
        {relatedArticles.length > 0 &&
          relatedArticles.map((article) => {
            return (
              <ArticleShort
                key={article.articleId}
                title={article.title}
                perex={article.perex}
                onClick={() => goToArticle(article.articleId)}
              />
            )
          })}
      </div>
    </div>
  )
}
