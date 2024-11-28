import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import AdSection from '../Ad/Announcement/index.js';
import Thirdsection from '../IntroductionPage/ThirdSection';

const Advertisementpage = () => (
  <div className='Advertisementpage'>
    <FirstSection />
    <AdSection />
    <Thirdsection />
  </div>
);

export default Advertisementpage;
