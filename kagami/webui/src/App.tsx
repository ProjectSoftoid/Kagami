import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage/index.js';
import AnnouncementPage from './page/Announcement/index.js';
import DownloadPage from './page/Download/index.js';
import DomainPage from './page/Domain/index.js';
import MirrorPage from './page/Mirror/index.js';
import StatePage from './page/State/index.js';
import AdminLogin from './page/AdminLogin/index.js';
import AdminDashboard from './page/AdminDashboard/index.js';
import WorkerDetail from './page/AdminDashboard/WorkerDetail/index.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/announcement' element={<AnnouncementPage />} />
        <Route path='/download' element={<DownloadPage />} />
        <Route path='/domain' element={<DomainPage />} />
        <Route path='/mirror' element={<MirrorPage />} />
        <Route path='/state' element={<StatePage />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/worker/:address' element={<WorkerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
