import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import LogoImage from '../../picture/logo.jpg';
import WordImage from '../../picture/word.jpg';
import styles from './styles.module.scss';

const Firstsection = () => {
  const navigate = useNavigate();

  const handleAdClick = () => {
    navigate('/announcement');
  };

  const handleDownloadClick = () => {
    navigate('/download');
  };

  const handleDomainClick = () => {
    navigate('/domain');
  };

  const handleMirrorClick = () => {
    navigate('/mirror');
  };

  const handleStateClick = () => {
    navigate('/state');
  };

  return (
    <div className={styles.Container}>
      <div className={styles.firstSection}>
        <div className={styles.logoSection}>
          <img src={LogoImage} alt='logo' className={styles.logo} />
          <img src={WordImage} alt='word' className={styles.word} />
        </div>
        <div className={styles.navLinks}>
          <a onClick={handleMirrorClick} className={styles.mirror}>鏡像</a>
          <a onClick={handleAdClick} className={styles.ad}>公告</a>
          <a onClick={handleDownloadClick} className={styles.download}>下載</a>
          <a onClick={handleDomainClick} className={styles.domain}>域名</a>
          <a onClick={handleStateClick} className={styles.state}>狀態</a>
        </div>
      </div>
    </div>
  );
};

export default Firstsection;
