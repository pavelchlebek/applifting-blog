import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { Screen } from './components/Screen/Screen';
import { ArticlesScreen } from './screens/ArticlesScreen/ArticlesScreen';
import { FileToImage } from './screens/FileToImage';
import { MarkdownEditor } from './screens/MarkdownEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileToImage />} />
        <Route path="/articles" element={<ArticlesScreen />} />
        <Route path="/editor" element={<MarkdownEditor />} />
        <Route
          path="/screen"
          element={
            <Screen>
              <ArticlesScreen />
            </Screen>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
