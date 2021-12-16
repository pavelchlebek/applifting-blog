import React from 'react';

import axios from 'axios';
import {
  Navigate,
  useNavigate,
} from 'react-router-dom';

import {
  API,
  tenant,
} from '../../api';
import { ReactComponent as Controls } from '../../assets/Union.svg';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Screen } from '../../components/Screen/Screen';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import { TableRow } from '../../components/TableRow/TableRow';
import { useAuthContext } from '../../store/auth-context';
import { IArticleDetail } from '../ArticleDetailScreen/ArticleDetailScreen';
import { IArticlesResponse } from '../ArticlesScreen/ArticlesScreen';
import classes from './MyArticlesScreen.module.css';

type TProps = NoChildren

interface IDeletedArticle {
  title: string
  id: string
  imageId: string
}

export const MyArticlesScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()
  const navigate = useNavigate()

  const [articlesListWithCommentsCount, setArticlesListWithCommentsCount] = React.useState<
    IArticleDetail[]
  >([])

  const getHeaders = React.useMemo(() => {
    if (authContext.token) {
      return {
        "X-API-KEY": tenant.apiKey,
        Authorization: authContext.token?.accessToken,
      }
    }
  }, [authContext.token])

  // sorting states (eg. by comments ASCENDING)
  const [commentsASC, setCommentsASC] = React.useState(false)
  const [titleASC, setTitleASC] = React.useState(false)
  const [perexASC, setPerexASC] = React.useState(false)

  const [showModal, setShowModal] = React.useState(false)

  const [deletedArticle, setDeletedArticle] = React.useState<IDeletedArticle>({
    title: "",
    id: "",
    imageId: "",
  })

  React.useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get<IArticlesResponse>(
          `${API.server}${API.endpoints.ARTICLES}`,
          {
            headers: getHeaders,
          }
        )
        const articles: IArticleDetail[] = []
        for (let i = 0; i < response.data.items.length; i++) {
          try {
            const articleDetailResponse = await axios.get<IArticleDetail>(
              `${API.server}${API.endpoints.ARTICLES}/${response.data.items[i].articleId}`,
              {
                headers: getHeaders,
              }
            )
            articles.push(articleDetailResponse.data)
          } catch (err) {
            console.log("error while fetching article comments count", err)
          }
        }
        setArticlesListWithCommentsCount(articles)
      } catch (err) {
        console.log(err)
      }
    }

    getArticles()
  }, [getHeaders])

  const handleDelete = (id: string, title: string, imageId: string) => {
    setDeletedArticle({ title: title, id: id, imageId: imageId })
    setShowModal(true)
  }

  const handleEdit = (id: string) => {
    navigate(`../edit-article/${id}`)
  }

  const sortByCommentsAmount = () => {
    setCommentsASC((prev) => !prev)
    if (commentsASC) {
      const items = [...articlesListWithCommentsCount]
      items.sort((a, b) => a.comments.length - b.comments.length)
      setArticlesListWithCommentsCount(items)
    } else {
      const items = [...articlesListWithCommentsCount]
      items.sort((a, b) => b.comments.length - a.comments.length)
      setArticlesListWithCommentsCount(items)
    }
  }

  // TODO figure out generic sorting function
  const sortByTitle = () => {
    setTitleASC((prev) => !prev)
    if (titleASC) {
      const items = [...articlesListWithCommentsCount]
      items.sort((a, b) => {
        if (a.title.toUpperCase() > b.title.toUpperCase()) return -1
        if (a.title.toUpperCase() < b.title.toUpperCase()) return 1
        return 0
      })
      setArticlesListWithCommentsCount(items)
    } else {
      const items = [...articlesListWithCommentsCount]
      items.sort((a, b) => {
        if (a.title.toUpperCase() < b.title.toUpperCase()) return -1
        if (a.title.toUpperCase() > b.title.toUpperCase()) return 1
        return 0
      })
      setArticlesListWithCommentsCount(items)
    }
  }

  const sortByPerex = () => {
    setPerexASC((prev) => !prev)
    if (perexASC) {
      const items = [...articlesListWithCommentsCount]
      items.sort((a, b) => {
        if (a.perex.toUpperCase() > b.perex.toUpperCase()) return -1
        if (a.perex.toUpperCase() < b.perex.toUpperCase()) return 1
        return 0
      })
      setArticlesListWithCommentsCount(items)
    } else {
      const items = [...articlesListWithCommentsCount]
      items.sort((a, b) => {
        if (a.perex.toUpperCase() < b.perex.toUpperCase()) return -1
        if (a.perex.toUpperCase() > b.perex.toUpperCase()) return 1
        return 0
      })
      setArticlesListWithCommentsCount(items)
    }
  }

  const deleteArticle = async () => {
    try {
      // first deleting an image if exists
      if (deletedArticle.imageId) {
        const responseImageDeleted = await axios.delete(
          `${API.server}${API.endpoints.IMAGES}/${deletedArticle.imageId}`,
          {
            headers: getHeaders,
          }
        )
      }

      // now deleting an article
      const responseArticleDeleted = await axios.delete(
        `${API.server}${API.endpoints.ARTICLES}/${deletedArticle.id}`,
        {
          headers: getHeaders,
        }
      )

      if (responseArticleDeleted.status === 204) {
        const currentArticles = [...articlesListWithCommentsCount]
        const newArticles = currentArticles.filter(
          (article) => article.articleId !== deletedArticle.id
        )
        setArticlesListWithCommentsCount(newArticles)
      }
      setShowModal(false)
    } catch (err) {
      console.log("error when deleting article: ", err)
    }
  }

  if (!authContext.token) return <Navigate to="../articles" />

  return (
    <Screen loggedIn={authContext.token ? true : false}>
      <Modal onModalClose={() => setShowModal(false)} show={showModal}>
        <div className={classes.modalBody}>
          <p className={classes.modalMessage}>
            Do you really want to delete article:
            <span className={classes.deletedArticle}>{deletedArticle.title}</span>
          </p>
          <div className={classes.modalButtons}>
            <Button color="primary" title="Delete" onClick={() => deleteArticle()} />
            <Button color="secondary" title="Cancel" onClick={() => setShowModal(false)} />
          </div>
        </div>
      </Modal>
      <div className={classes.page}>
        <div className={classes.headingRow}>
          <ScreenHeading title="My articles" />
          <div className={classes.buttonWrapper}>
            <Button
              onClick={() => navigate("/new-article")}
              color="primary"
              title="Create new article"
            />
          </div>
        </div>
        <table className={classes.table}>
          <thead className={classes.tableHeadingRow}>
            <tr>
              <th>
                <div onClick={() => sortByTitle()} className={classes.headingCell}>
                  Article title <Controls className={classes.controls} />
                </div>
              </th>
              <th>
                <div onClick={() => sortByPerex()} className={classes.headingCell}>
                  Perex <Controls className={classes.controls} />
                </div>
              </th>
              <th>
                <div className={classes.headingCell}>
                  Author <Controls className={classes.controls} />
                </div>
              </th>
              <th className={classes.commentsCell}>
                <div onClick={() => sortByCommentsAmount()} className={classes.headingCell}>
                  # of comments <Controls className={classes.controls} />
                </div>
              </th>
              <th>
                <div className={classes.headingCell}>Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {articlesListWithCommentsCount.length > 0 &&
              articlesListWithCommentsCount.map((article) => {
                return (
                  <TableRow
                    key={article.articleId}
                    author={tenant.name}
                    comments={article.comments.length}
                    onDelete={() => handleDelete(article.articleId, article.title, article.imageId)}
                    onEdit={() => handleEdit(article.articleId)}
                    perex={article.perex.slice(0, 60) + "..."}
                    title={article.title.slice(0, 25) + "..."}
                  />
                )
              })}
          </tbody>
        </table>
      </div>
    </Screen>
  )
}
