import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import DomainAnnounce from '../DomainPage/DomainAnnounce';
import ThirdSection from '../IntroductionPage/ThirdSection';

const Domainpage = () => (
  <div className='Advertisementpage'>
    <FirstSection />
    <DomainAnnounce />
    <ThirdSection />
  </div>
);

export default Domainpage;
