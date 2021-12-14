import React from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  API,
  tenant,
} from '../../api';
import { ReactComponent as Controls } from '../../assets/Union.svg';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import { TableRow } from '../../components/TableRow/TableRow';
import { useAuthContext } from '../../store/auth-context';
import { IArticleDetail } from '../ArticleDetailScreen/ArticleDetailScreen';
import { IArticlesResponse } from '../ArticlesScreen/ArticlesScreen';
import classes from './MyArticlesScreen.module.css';

type TProps = NoChildren

export const MyArticlesScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()
  const navigate = useNavigate()

  const [articlesListWithCommentsCount, setArticlesListWithCommentsCount] = React.useState<
    IArticleDetail[]
  >([])

  let headers = {}
  if (authContext.token) {
    headers = {
      "X-API-KEY": tenant.apiKey,
      Authorization: authContext.token?.accessToken,
    }
  }

  // sorting states (eg. by comments ASCENDING)
  const [commentsASC, setCommentsASC] = React.useState(false)
  const [titleASC, setTitleASC] = React.useState(false)
  const [perexASC, setPerexASC] = React.useState(false)

  React.useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get<IArticlesResponse>(
          `${API.server}${API.endpoints.ARTICLES}`,
          {
            headers: headers,
          }
        )
        const articles: IArticleDetail[] = []
        for (let i = 0; i < response.data.items.length; i++) {
          try {
            const articleDetailResponse = await axios.get<IArticleDetail>(
              `${API.server}${API.endpoints.ARTICLES}/${response.data.items[i].articleId}`,
              {
                headers: headers,
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
  }, [])

  const handleDelete = (id: string) => {
    console.log("deleting article #: ", id)
  }

  const handleEdit = (id: string) => {
    console.log("editing article #: ", id)
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

  return (
    <Screen loggedIn={authContext.token ? true : false}>
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
                    onDelete={() => handleDelete(article.articleId)}
                    onEdit={() => handleEdit(article.articleId)}
                    perex={article.perex.slice(0, 60) + "..."}
                    title={article.title}
                  />
                )
              })}
          </tbody>
        </table>
      </div>
    </Screen>
  )
}
