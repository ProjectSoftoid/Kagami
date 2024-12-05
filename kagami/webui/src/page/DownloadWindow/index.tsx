import React, { useEffect, useState } from 'react';
import styles from './Modal.module.scss';
import { getDownloadList, Download } from '../../api/download';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [downloads, setDownloads] = useState<Download[]>([]); // 全部下载数据
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null); // 当前筛选分类
  const [filteredResource, setFilteredResource] = useState<string | null>(null); // 当前筛选资源名称
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载下载数据
  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const data = await getDownloadList();
        setDownloads(data);
        setError(null);
      } catch (err) {
        setError('加载下载列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  // 控制激活按钮的状态
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category); // 设置当前激活的分类
    setFilteredCategory(category);
    setFilteredResource(null); // 重置资源选择
  };

  if (!isOpen) return null; // 如果弹窗未打开，不渲染任何内容

  // 筛选符合分类的资源
  const filteredDownloads = filteredCategory
    ? downloads.filter((item) => item.category === filteredCategory)
    : downloads;

  // 筛选文件列表
  const filteredFiles =
    filteredResource && filteredDownloads.length > 0
      ? filteredDownloads.find((item) => item.resource_name === filteredResource)?.file_list || []
      : [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // 阻止点击内容区域触发关闭
      >
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <h2>下載</h2>

        {/* 第一条分割线 */}
        <hr className={styles.divider} />

        {/* 分类按钮：当未选择具体资源名称时显示 */}
        {!filteredResource && (
          <>
            <div className={styles.categories}>
              <button
                className={activeCategory === 'OS' ? `${styles.active}` : ''}
                onClick={() => handleCategoryClick('OS')}
              >
                操作系統
              </button>
              <button
                className={activeCategory === 'app' ? `${styles.active}` : ''}
                onClick={() => handleCategoryClick('app')}
              >
                應用軟件
              </button>
              <button
                className={activeCategory === 'type' ? `${styles.active}` : ''}
                onClick={() => handleCategoryClick('type')}
              >
                字體
              </button>
            </div>

            {/* 第二条分割线 */}
            <hr className={styles.divider} />
          </>
        )}

        {/* 渲染资源名称 */}
        {filteredCategory && !filteredResource && (
          <ul className={styles.resourceList}>
            {filteredDownloads.map((item) => (
              <li
                key={item.resource_name}
                onClick={() => setFilteredResource(item.resource_name)} // 点击筛选文件列表
                className={styles.resourceItem}
              >
                {item.resource_name}
              </li>
            ))}
          </ul>
        )}

        {/* 渲染文件列表 */}
        {filteredResource && (
          <div className={styles.fileList}>
            <h3>{filteredResource}</h3>
            <ul>
              {filteredFiles.map((file, index) => (
                <li key={index}>
                  <a href={file.file} target="_blank" rel="noopener noreferrer">
                    <strong>{file.version}</strong>
                  </a>
                </li>
              ))}
            </ul>
            <button onClick={() => setFilteredResource(null)}>返回资源列表</button>
          </div>
        )}

        {/* 加载和错误状态 */}
        {loading && <p>加载中...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default DownloadModal;
