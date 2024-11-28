import React, {useEffect, useState} from 'react';
import logo from '../../../assets/kagami.png';
import styles from './styles.module.scss';



const Domainsection: React.FC = () => {
  const [domain, setDomain] = useState<Domain | undefined>(undefined);

  useEffect(() => {
    fetch('http://127.0.0.1:4523/m1/5454758-5129914-default/api/domain')
      .then(async response => response.json())
      .then(data => {
        setDomain(data as Domain);
      })
      .catch((error: unknown) => {
        console.error('获取域名失败:', error);
      });
  }, []);

  return (
    <div className={styles.Domainsection}>
      <h1>域名</h1>
      {domain ? (
        <div className={styles.DomainBox}>
          <p>自动选择: {domain.domain.auto}</p>
          <p>IPv4: {domain.domain.IPv4}</p>
          <p>IPv6: {domain.domain.IPv6}</p>
          <img src={logo} alt='logo' className={styles.logo} />
        </div>
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );
};

export default Domainsection;
