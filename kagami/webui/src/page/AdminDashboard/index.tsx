import React, { useState } from 'react';
import FirstSection from '../IntroductionPage/FirstSection';
import ThirdSection from '../IntroductionPage/ThirdSection';
import WorkerManagement from './WorkerManagement';
import UserManagement from './UserManagement';
import ServerManagement from './ServerManagement';
import styles from './styles.module.scss';

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('server');

  const renderContent = () => {
    switch (activeMenu) {
      case 'worker':
        return <WorkerManagement />;
      case 'user':
        return <UserManagement />;
      case 'server':
        return <ServerManagement />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.firstSection}>
        <FirstSection showNav={false} />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.menuTitle}>選擇</div>
          <a 
            className={`${styles.menuItem} ${activeMenu === 'server' ? styles.active : ''}`}
            onClick={() => setActiveMenu('server')}
          >
            Server Management
          </a>
          <a 
            className={`${styles.menuItem} ${activeMenu === 'user' ? styles.active : ''}`}
            onClick={() => setActiveMenu('user')}
          >
            User Management
          </a>
          <a 
            className={`${styles.menuItem} ${activeMenu === 'worker' ? styles.active : ''}`}
            onClick={() => setActiveMenu('worker')}
          >
            Worker Management
          </a>
        </div>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
     </div>
  );
};

export default AdminDashboard;
