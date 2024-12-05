import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import ListSection from '../IntroductionPage/ListSection';
import ThirdSection from '../IntroductionPage/ThirdSection';
import styles from './styles.module.scss'

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.HomePage}>
      <FirstSection />
      <ListSection />
      <ThirdSection />
    </div>
  );
};

export default HomePage;
