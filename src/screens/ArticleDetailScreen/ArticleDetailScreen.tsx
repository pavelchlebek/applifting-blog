import React from 'react';

import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  useNavigate,
  useParams,
} from 'react-router';

import { API } from '../../api';
import { ArticleShort } from '../../components/ArticleShort/ArticleShort';
import { Button } from '../../components/Button/Button';
import { Comment } from '../../components/Comment/Comment';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import { TextInput } from '../../components/TextInput/TextInput';
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

  const [newComment, setNewComment] = React.useState("")
  const [commentAuthor, setCommentAuthor] = React.useState("")

  const [inputsValid, setInputsValid] = React.useState(true)

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
      if (articleDetail) {
        const currentComments = [...articleDetail.comments]
        const filteredComments = currentComments.filter(
          (comment) => comment.commentId !== commentId
        )
        filteredComments.push(response.data)
        setArticleDetail({ ...articleDetail, comments: filteredComments })
        // console.log(filteredComments)
      }
    } catch (err) {
      console.log("votingUp error: ", err)
    }
  }
  // TODO: one function with parameter (up/down)
  const voteDown = async (commentId: string) => {
    try {
      const response = await axios.post<IComment>(
        `${API.server}${API.endpoints.COMMENTS}/${commentId}/vote/down`,
        null,
        {
          headers: headers,
        }
      )
      // updating score for given comment
      if (articleDetail) {
        const currentComments = [...articleDetail.comments]
        const filteredComments = currentComments.filter(
          (comment) => comment.commentId !== commentId
        )
        filteredComments.push(response.data)
        setArticleDetail({ ...articleDetail, comments: filteredComments })
        // console.log(filteredComments)
      }
      // console.log("updatedScore: ", response.data.score)
    } catch (err) {
      console.log("votingUp error: ", err)
    }
  }

  /**
   * posting new comment
   */
  const handleSendComment = async () => {
    if (newComment.length > 5 && commentAuthor.length > 5) {
      setInputsValid(true)
      try {
        const response = await axios.post<IComment>(
          `${API.server}${API.endpoints.COMMENTS}`,
          {
            articleId: articleId,
            author: commentAuthor,
            content: newComment,
          },
          {
            headers: headers,
          }
        )
        // adding comment from response to comments
        if (articleDetail) {
          const currentComments = [...articleDetail.comments]
          currentComments.push(response.data)
          setArticleDetail({ ...articleDetail, comments: currentComments })
        }
        setNewComment("")
        setCommentAuthor("")
      } catch (err) {
        console.log("Sending comment error: ", err)
      }
    } else {
      setInputsValid(false)
    }
  }

  const sortedComments = articleDetail?.comments.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

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
            <form className={classes.form}>
              <TextInput
                placeholder="Join the discussion"
                value={newComment}
                onChange={(event) => setNewComment(event.currentTarget.value)}
              />
              <div className={classes.sendGroup}>
                <div className={classes.nameInputWrapper}>
                  <TextInput
                    placeholder="Your name"
                    value={commentAuthor}
                    onChange={(event) => setCommentAuthor(event.currentTarget.value)}
                  />
                </div>
                <div className={classes.buttonWrapper}>
                  <Button
                    style={{ paddingTop: "12px", paddingBottom: "12px" }}
                    color="primary"
                    onClick={handleSendComment}
                    title="Post comment"
                  />
                </div>
              </div>
            </form>
            {!inputsValid && (
              <div className={classes.alert}>
                Both your name and your comment must have at least 6 characters!
              </div>
            )}
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
