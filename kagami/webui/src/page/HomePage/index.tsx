import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import ListSection from '../IntroductionPage/ListSection';
import ThirdSection from '../IntroductionPage/ThirdSection';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className='Homepage'>
      <FirstSection />
      <ListSection />
      <ThirdSection />
    </div>
  );
};

export default Homepage;
