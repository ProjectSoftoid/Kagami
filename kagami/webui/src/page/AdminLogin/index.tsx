import React, { useState } from 'react';
import { adminLogin } from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import styles from './styles.module.scss';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await adminLogin({
        username,
        password,
      });
      
      localStorage.setItem('admin_token', token);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.firstSection}>
        <FirstSection showNav={false} />
      </div>
      <div className={styles.mainContent}>
        <img src="/src/assets/logo.png" alt="Kagami Logo" className={styles.logo} />
        <h1 className={styles.title}>Admin Console</h1>
        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <div className={styles.label}>Admin name</div>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Value"
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.label}>Password</div>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Value"
            />
          </div>
          <button className={styles.loginButton} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
