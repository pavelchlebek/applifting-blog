import React from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';

import { API } from '../../api';
import { Article } from '../../components/Article/Article';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import classes from './ArticlesScreen.module.css';

type TProps = NoChildren

const style: React.CSSProperties = {
  alignSelf: "center",
  // backgroundColor: "#ccc",
  // marginLeft: "auto",
  // marginRight: "auto",
}

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
  "X-API-KEY": "ba113e43-e68f-4afb-bad5-e73551f3f06f",
  Authorization: "14ca9347-62d7-41b9-a087-10b916cf6bbe",
}

export const ArticlesScreen: React.FC<TProps> = () => {
  const [articlesList, setArticlesList] = React.useState<IArticleWithImageId[]>([])

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
    <div style={style}>
      <div className={classes.heading}>
        <ScreenHeading title="Recent articles" />
      </div>

      {articlesList &&
        articlesList.map((article) => {
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
  )
}
