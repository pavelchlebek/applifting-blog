import React from 'react';

import axios from 'axios';

import { API } from '../../api';
import { Article } from '../../components/Article/Article';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';

type TProps = NoChildren

const style: React.CSSProperties = {
  alignSelf: "center",
  // backgroundColor: "#ccc",
  // marginLeft: "auto",
  // marginRight: "auto",
}

interface IArticleWithImageId {
  articleId: string
  title: string
  perex: string
  imageId: string
  lastUpdatedAt: string
  createdAt: string
}
interface IArticlesResponse {
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

  return (
    <div style={style}>
      <ScreenHeading title="Recent articles" />
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
              onClick={() => console.log("going to details of article no: ", article.articleId)}
            />
          )
        })}
    </div>
  )
}
