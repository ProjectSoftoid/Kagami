import React, { useEffect, useState } from 'react';
import { getResource, type ResourceInfo } from '../../../api/resourceInfo';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const ListSection: React.FC = () => {
  const [resource, setResource] = useState<ResourceInfo[]>([]); // 原始数据
  const [filteredResource, setFilteredResource] = useState<ResourceInfo[]>([]); // 过滤后的数据
  const [searchQuery, setSearchQuery] = useState(''); // 搜索框内容

  // 获取资源数据
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResource();
        setResource(data);
        setFilteredResource(data); // 默认显示全部
      } catch (error) {
        console.error('加载资源失败:', error);
      }
    };

    fetchResource();
  }, []);

  // 根据搜索框输入实时过滤数据
  useEffect(() => {
    const filtered = resource.filter(item =>
      item.name.toLowerCase().startsWith(searchQuery.toLowerCase()),
    );
    setFilteredResource(filtered);
  }, [searchQuery, resource]);

  return (

    <div className={styles.ListSection}>
      <div className={styles.searchContainer}>
        <input
          type='text'
          placeholder='Searhing for Mirror....'
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
          }}
          className={styles.searchInput}
        />
      </div>
      {filteredResource.length > 0 ? (
        <ul className={styles.bottom}>
          {filteredResource.map(item => (
            <li key={item.name} className={styles.resourceBox}>
              {/* 左侧：资源名称和小问号 */}
              <div className={styles.left}>
              <Link to={`/helper/${item.name}/detail`} className={styles.nameLink}>
                <span className={styles.name}>{item.name}</span>
              </Link>
                {item.helper && (
                  <a
                    href={`/helper/${item.name}`}
                    className={styles.helperLink}
                    title='查看帮助'
                  >
                    ❓
                  </a>
                )}
              </div>
              {/* 右侧：状态 */}
              <span className={styles.status}>{item.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>没有匹配的资源</p>
      )}
    </div>
  );
};

export default ListSection;
