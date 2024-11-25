import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

interface OperatingSystem {
    id: number;
    OS: {
        name: string;
        content: string;
    };
}

const Downsection: React.FC = () => {
    const [OS, setOS] = useState<OperatingSystem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedName, setSelectedName] = useState<string>('');

    useEffect(() => {
        // Fetch operating system data from the backend
        fetch('http://127.0.0.1:4523/m1/5454758-5129914-default/api/OS')
            .then(response => response.json())
            .then(data => setOS(data))
            .catch(error => console.error('Failed to fetch operating systems:', error));
    }, []);

    const renderNames = () => {
        switch (selectedCategory) {
            case '操作系統':
                return OS.map(os => (
                    <div key={os.id} onClick={() => setSelectedName(os.OS.name)} className={styles.nameItem}>
                        {os.OS.name}
                    </div>
                ));
            // Add logic for application software and fonts here
            default:
                return OS.map(os => (
                    <div key={os.id} onClick={() => setSelectedName(os.OS.name)} className={styles.nameItem}>
                        {os.OS.name}
                    </div>
                ));
        }
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case '操作系統':
                const selectedOS = OS.find(os => os.OS.name === selectedName);
                return selectedOS ? <div>{selectedOS.OS.content}</div> : <div></div>;
            // Add logic for application software and fonts here
            default:
                const selectedOS1 = OS.find(os => os.OS.name === selectedName);
                return selectedOS1 ? <div>{selectedOS1.OS.content}</div> : <div>hello</div>;
        }
    };

    return (
        <div className={styles.Downsection}>
            <h1>下载</h1>
            <div className={styles.divider}></div>
            <div className={styles.spanContainer}>
                <span onClick={() => setSelectedCategory('操作系統')}>操作系統</span>
                <span onClick={() => setSelectedCategory('應用軟件')}>應用軟件</span>
                <span onClick={() => setSelectedCategory('字體')}>字體</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.contentContainer}>
                <div className={styles.names}>
                    {renderNames()}
                </div>
                <div className={styles.verticalDivider}></div>
                <div className={styles.content}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Downsection;