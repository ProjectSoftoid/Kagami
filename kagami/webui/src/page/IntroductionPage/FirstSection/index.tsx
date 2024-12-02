import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoImage from '../../../assets/logo.png';
import WordImage from '../../../assets/word.png';
import styles from './styles.module.scss';
import  Modal from '../../DomainWindow';


const FirstSection = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 弹窗状态

  const handleAdClick = () => {
    navigate('/announcement');
  };

  const handleDownloadClick = () => {
    navigate('/download');
  };

  const handleDomainClick = () => {
    setIsModalOpen(true); // 打开弹窗
  };

  const handleStateClick = () => {
    navigate('/state');
  };

  const closeModal = () => {
    setIsModalOpen(false); // 关闭弹窗
  };

  return (
    <div className={styles.Container}>
      <div className={styles.firstSection}>
        <div className={styles.logoSection}>
          <img src={LogoImage} alt='logo' className={styles.logo} />
          <img src={WordImage} alt='word' className={styles.word} />
        </div>
        <div className={styles.navLinks}>
          <a onClick={handleAdClick} className={styles.ad}>公告</a>
          <a onClick={handleDownloadClick} className={styles.download}>下載</a>
          <a onClick={handleDomainClick} className={styles.domain}>域名</a>
          <a onClick={handleStateClick} className={styles.state}>狀態</a>
        </div>
      </div>

      {/* 弹窗内容 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.DomainSection}>
          <h2>域名选择</h2>
          <ul>
            <li>自动选择: https://mirrors.kagami.must.edu.cn</li>
            <li>IPv4: https://mirrors6.kagami.must.edu.cn</li>
            <li>IPv6: https://mirrors4.kagami.must.edu.cn</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default FirstSection;
