import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage/index.js';
import AnnouncementPage from './page/Announcement/index.js';
import StatePage from './page/State/index.js';
import AdminLogin from './page/AdminLogin/index.js';
import AdminDashboard from './page/AdminDashboard/index.js';
import WorkerDetail from './page/AdminDashboard/WorkerDetail/index.js';
import HelpPage from './page/HelpPage/index.js';
import DetailPage from './page/DetailPage/index.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/announcement' element={<AnnouncementPage />} />

        <Route path='/helper/:resource_name' element={<HelpPage />} />
        <Route path='/helper/:resource_name/detail'element={<DetailPage />} />

        <Route path='/state' element={<StatePage />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/worker/:address' element={<WorkerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
