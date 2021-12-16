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
import {
  EditArticleScreen,
} from './screens/EditArticleScreen/EditArticleScreen';
import { FileToImage } from './screens/FileToImage';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { MarkdownEditor } from './screens/MarkdownEditor';
import { MyArticlesScreen } from './screens/MyArticlesScreen/MyArticlesScreen';
import { NewArticleScreen } from './screens/NewArticleScreen/NewArticleScreen';
import { AuthContextProvider } from './store/auth-context';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/fileToImage" element={<FileToImage />} />
          <Route path="/articlesTest" element={<ArticlesScreen />} />
          <Route path="/editor" element={<MarkdownEditor />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<ArticlesScreen />} />
          <Route path="/article-detail/:articleId" element={<ArticleDetailScreen />} />
          <Route path="/new-article" element={<NewArticleScreen />} />
          <Route path="/my-articles" element={<MyArticlesScreen />} />
          <Route path="/edit-article/:articleId" element={<EditArticleScreen />} />
          <Route
            path="*"
            element={
              <Screen loggedIn={false}>
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              </Screen>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
