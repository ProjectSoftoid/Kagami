import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import FirstSection from '../IntroductionPage/FirstSection';
import DownSection from '../DownloadPage/DownloadWindow';

const Downloadpage = () => (
  <div className='Downloadpage'>
    <FirstSection />
    <DownSection />

  </div>
);

export default Downloadpage;
