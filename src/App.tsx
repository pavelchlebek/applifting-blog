import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { Screen } from './components/Screen/Screen';
import {
  ArticleDetailScreen,
} from './screens/ArticleDetailScreen/ArticleDetailScreen';
import { ArticlesScreen } from './screens/ArticlesScreen/ArticlesScreen';
import { FileToImage } from './screens/FileToImage';
import { MarkdownEditor } from './screens/MarkdownEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileToImage />} />
        <Route path="/articlesTest" element={<ArticlesScreen />} />
        <Route path="/editor" element={<MarkdownEditor />} />
        <Route
          path="/articles"
          element={
            <Screen>
              <ArticlesScreen />
            </Screen>
          }
        />
        <Route
          path="/article-detail/:articleId"
          element={
            <Screen>
              <ArticleDetailScreen />
            </Screen>
          }
        />
        <Route
          path="*"
          element={
            <Screen>
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            </Screen>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
