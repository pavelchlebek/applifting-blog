import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { ArticlesScreen } from './screens/ArticlesScreen';
import { FileToImage } from './screens/FileToImage';
import { MarkdownEditor } from './screens/MarkdownEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileToImage />} />
        <Route path="/articles" element={<ArticlesScreen />} />
        <Route path="/editor" element={<MarkdownEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
