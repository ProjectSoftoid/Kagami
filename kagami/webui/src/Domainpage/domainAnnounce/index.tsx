import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import logo from '../../picture/kagami.jpg';
interface Domain {
    id: number;
    domain: {
        auto: string;
        IPv4: string;
        IPv6: string;
    };
}

const Domainsection: React.FC = () => {
    const [domain, setDomain] = useState<Domain | null>(null);

    useEffect(() => {
        fetch('http://127.0.0.1:4523/m1/5454758-5129914-default/api/domain')
            .then(response => response.json())
            .then(data => setDomain(data))
            .catch(error => console.error('获取域名失败:', error));
    }, []);

    return (
        <div className={styles.Domainsection}>
            <h1>域名</h1>
            {domain ? (
                <div className={styles.DomainBox}>
                    <p>自动选择: {domain.domain.auto}</p>
                    <p>IPv4: {domain.domain.IPv4}</p>
                    <p>IPv6: {domain.domain.IPv6}</p>
                    <img src={logo} alt="logo" className={styles.logo} />
                </div>
            ) : (
                <p>加载中...</p>
            )}
        </div>
    );
}

export default Domainsection;