import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import {
  ArticleDetailScreen,
} from './screens/ArticleDetailScreen/ArticleDetailScreen';
import { ArticlesScreen } from './screens/ArticlesScreen/ArticlesScreen';
import {
  EditArticleScreen,
} from './screens/EditArticleScreen/EditArticleScreen';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { MyArticlesScreen } from './screens/MyArticlesScreen/MyArticlesScreen';
import { NewArticleScreen } from './screens/NewArticleScreen/NewArticleScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { AuthContextProvider } from './store/auth-context';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<ArticlesScreen />} />
          <Route path="/article-detail/:articleId" element={<ArticleDetailScreen />} />
          <Route path="/new-article" element={<NewArticleScreen />} />
          <Route path="/my-articles" element={<MyArticlesScreen />} />
          <Route path="/edit-article/:articleId" element={<EditArticleScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
