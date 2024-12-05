import React, {useState,useEffect} from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom';
import LogoImage from '../../../assets/logo.png';
import WordImage from '../../../assets/word.png';
import styles from './styles.module.scss';
import  Modal1 from '../../DomainWindow';
import { Domain, getDomain } from '../../../api/domain';
import { Download,getDownloadList } from '../../../api/download';
import Modal2 from '../../DownloadWindow';


const FirstSection: React.FC<{ showNav?: boolean }> = ({ showNav = true }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 弹窗状态(domain)
  const [isDownloadOpen, setIsDownloadOpen] = useState(false); // 弹窗状态(download)
  const { resource_name } = useParams<{ resource_name: string }>(); // 获取路由参数
  const [domain, setDomain]=useState<Domain | null>(null);
  const [downloads, setDownloads]=useState<Download[] | null>(null);

  useEffect(() =>{
    const fetchDomain = async () => {
      try {
        const data =await getDomain();
        console.log('获取的域名:', data);
        setDomain(data);
      }catch (err){
        console.error('加载域名失败:', err);

    }
  };
  fetchDomain();
}, []);
  useEffect(() =>{
    const fetchDownload = async (resourceName:string) => {
      try {
        const data =await getDownloadList(resourceName);
        console.log('获取的下载:', data);
        setDownload(data);
      }catch (err){
        console.error('加载下载失败:', err);

    }
  };
  if(resource_name){
  fetchDownload(resource_name);
  }
}, [resource_name]);

  const handleAdClick = () => {
    navigate('/announcement');
  };

  const handleDownloadClick = () => {
    setIsDownloadOpen(true); // 打开弹窗
  };

  const handleDomainClick = () => {
    setIsModalOpen(true); // 打开弹窗
  };

  const handleStateClick = () => {
    navigate('/state');
  };

  const closeModal = () => {
    setIsModalOpen(false); // 关闭弹窗
  };
  const closeDownload = () => {
    setIsDownloadOpen(false); // 关闭弹窗
  };

  return (
    <div className={styles.Container}>
      <div className={styles.firstSection}>
        <div className={styles.logoSection} onClick={() => navigate('/')}>
          <img src={LogoImage} alt='logo' className={styles.logo} />
          <img src={WordImage} alt='word' className={styles.word} />
        </div>
        {showNav && (
          <div className={styles.navLinks}>
            <a onClick={handleAdClick} className={styles.ad}>公告</a>
            <a onClick={handleDownloadClick} className={styles.download}>下載</a>
            <a onClick={handleDomainClick} className={styles.domain}>域名</a>
            <a onClick={handleStateClick} className={styles.state}>狀態</a>
          </div>
        )}
      </div>

      {/* 弹窗内容 */}
      <Modal1 isOpen={isModalOpen} onClose={closeModal}>
  <div className={styles.DomainSection}>
    <h2>域名选择</h2>
    {domain ? (
      <ul>
        <li className={styles.domainItem}>
          <strong>自动选择:</strong> {domain.autoSelect_ip}
        </li>
        <li className={styles.domainItem}>
          <strong>IPv4:</strong> {domain.ipv4}
        </li>
        <li className={styles.domainItem}>
          <strong>IPv6:</strong> {domain.ipv6}
        </li>
      </ul>
    ) : (
      <p>正在加载域名数据...</p> // 占位内容
    )}
  </div>
</Modal1>
  <Modal2 isOpen={isDownloadOpen} onClose={closeDownload}>
  </Modal2>
  </div>
  );
};

export default FirstSection;
