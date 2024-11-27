import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import SecondSection from '../IntroductionPage/SecondSection';
import ThirdSection from '../IntroductionPage/ThirdSection';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className='Homepage'>
      <FirstSection />
      <SecondSection />
      <ThirdSection />
    </div>
  );
};

export default Homepage;
