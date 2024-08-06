import { PostPage } from './components/PostPage';
import { ImageViewer } from './components/ImageViewer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={PostPage} />
          <Route path='/og/*' Component={ImageViewer} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App