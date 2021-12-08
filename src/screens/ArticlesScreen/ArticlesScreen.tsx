import React from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';

import {
  API,
  tenant,
} from '../../api';
import { Article } from '../../components/Article/Article';
import { Screen } from '../../components/Screen/Screen';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import { useAuthContext } from '../../store/auth-context';
import classes from './ArticlesScreen.module.css';

type TProps = NoChildren

export interface IArticleWithImageId {
  articleId: string
  title: string
  perex: string
  imageId: string
  lastUpdatedAt: string
  createdAt: string
}
export interface IArticlesResponse {
  pagination: {
    offset: number
    limit: number
    total: number
  }
  items: IArticleWithImageId[]
}

const headers = {
  "X-API-KEY": tenant.apiKey,
  // Authorization: "14ca9347-62d7-41b9-a087-10b916cf6bbe",
}

export const ArticlesScreen: React.FC<TProps> = () => {
  const [articlesList, setArticlesList] = React.useState<IArticleWithImageId[]>([])

  const authContext = useAuthContext()
  // console.log("Auth Context: ", authContext)

  const navigate = useNavigate()

  React.useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get<IArticlesResponse>(
          `${API.server}${API.endpoints.ARTICLES}`,
          {
            headers: headers,
          }
        )
        setArticlesList(response.data.items)
      } catch (err) {
        console.log(err)
      }
    }

    getArticles()
  }, [])

  const goToDetails = (articleId: string) => {
    const detailUrl = `../article-detail/${articleId}`
    navigate(detailUrl)
  }

  return (
    <Screen loggedIn={false}>
      <div>
        <div>{authContext.token?.accessToken}</div>
        <div className={classes.heading}>
          <ScreenHeading title="Recent articles" />
        </div>

        {articlesList &&
          articlesList
            .sort(
              (a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
            )
            .map((article) => {
              return (
                <Article
                  key={article.articleId}
                  author="Palkin Palisandr"
                  perex={article.perex}
                  published={new Date(article.lastUpdatedAt)}
                  imageId={article.imageId}
                  title={article.title}
                  onClick={() => goToDetails(article.articleId)}
                />
              )
            })}
      </div>
    </Screen>
  )
}
