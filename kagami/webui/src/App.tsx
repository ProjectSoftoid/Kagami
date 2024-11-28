import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage/index.js';
import AnnouncementPage from './page/Announcement/index.js';
import DownloadPage from './page/Download/index.js';
import DomainPage from './page/Domain/index.js';
import MirrorPage from './page/Mirror/index.js';
import StatePage from './page/State/state.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/announcement' element={<AnnouncementPage />} />
        <Route path='/download' element={<DownloadPage />} />"
        <Route path='/domain' element={<DomainPage />} />
        <Route path='/mirror' element={<MirrorPage />} />
        <Route path='/state' element={<StatePage />} />
      </Routes >
    </Router>
  );
}

export default App;
