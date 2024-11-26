import React, {useState, useEffect} from 'react';
import styles from './styles.module.scss';

type OperatingSystem = {
  id: number;
  OS: {
    name: string;
    content: string;
  };
};

const Downsection: React.FC = () => {
  const [operatingSystems, setOperatingSystems] = useState<OperatingSystem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');

  useEffect(() => {
    // Fetch operating system data from the backend
    fetch('http://127.0.0.1:4523/m1/5454758-5129914-default/api/OS')
      .then(async response => response.json() as Promise<OperatingSystem[]>)
      .then((data: OperatingSystem[]) => {
        setOperatingSystems(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch operating systems:', error);
      });
  }, []);

  const renderNames = () => {
    switch (selectedCategory) {
      case '操作系統': {
        return operatingSystems.map(os => (
          <div key={os.id} onClick={() => {
            setSelectedName(os.OS.name);
          }} className={styles.nameItem}>
            {os.OS.name}
          </div>
        ));
      }

      // Add logic for application software and fonts here
      default: {
        return operatingSystems.map((os: OperatingSystem) => (
          <div key={os.id} onClick={() => {
            setSelectedName(os.OS.name);
          }} className={styles.nameItem}>
            {os.OS.name}
          </div>
        ));
      }
    }
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case '操作系統': {
        const selectedOs = operatingSystems.find(os => os.OS.name === selectedName);
        return selectedOs ? <div>{selectedOs.OS.content}</div> : <div></div>;
      }

      // Add logic for application software and fonts here
      default: {
        const selectedOs1 = operatingSystems.find(os => os.OS.name === selectedName);
        return selectedOs1 ? <div>{selectedOs1.OS.content}</div> : <div>hello</div>;
      }
    }
  };

  return (
    <div className={styles.Downsection}>
      <h1>下载</h1>
      <div className={styles.divider}></div>
      <div className={styles.spanContainer}>
        <span onClick={() => {
          setSelectedCategory('操作系統');
        }}>操作系統</span>
        <span onClick={() => {
          setSelectedCategory('應用軟件');
        }}>應用軟件</span>
        <span onClick={() => {
          setSelectedCategory('字體');
        }}>字體</span>
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
