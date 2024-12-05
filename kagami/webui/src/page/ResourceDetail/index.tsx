import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { ResourceInfo, getResource } from '../../api/resourceInfo';
import { ResourceDetail, getResourceDetail } from '../../api/resourceDetail';

const DetailSection: React.FC = () => {
  const { resource_name } = useParams<{ resource_name: string }>(); // 动态获取路由参数
  const [resourceList, setResourceList] = useState<ResourceInfo[]>([]); // 资源列表
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<ResourceDetail | null>(null); // 资源详情数据
  const [detailError, setDetailError] = useState<string | null>(null); // 资源详情加载错误
  const [loading, setLoading] = useState(true); // 通用加载状态
  const navigate = useNavigate(); // 路由导航

  // 加载资源列表
  useEffect(() => {
    const fetchResourceList = async () => {
      try {
        const data = await getResource();
        console.log('获取的资源列表:', data);
        setResourceList(data);
        setResourceError(null);
      } catch (err) {
        console.error('加载资源列表失败:', err);
        setResourceError('加载资源列表失败，请稍后再试。');
      }
    };

    fetchResourceList();
  }, []);

  // 加载资源详情
  useEffect(() => {
    const fetchDetailData = async (resourceName: string) => {
      try {
        const data = await getResourceDetail(resourceName);
        setDetailData(data);
        setDetailError(null);
      } catch (err) {
        console.error('加载资源详情失败:', err);
        setDetailError('加载资源详情失败，请稍后再试。');
      } finally {
        setLoading(false);
      }
    };

    if (resource_name) {
      fetchDetailData(resource_name);
    }
  }, [resource_name]);

  // 通用加载与错误处理
  if (loading) {
    return <p>加载中...</p>;
  }

  if (detailError || resourceError) {
    return <p>{detailError || resourceError}</p>;
  }
  const handleButtonClick = () => {
    navigate(`/helper/${resource_name}`); // 跳转到 detail 路径
  };

  return (
    <div className={styles.DetailPage}>
      <div className={styles.sidebar}>
        <h2>选择资源</h2>
        <ul>
          {resourceList.map((resource) => (
            <li key={resource.name} className={styles.name}>
              <Link to={`/helper/${resource.name}/detail`} className={styles.name}>
                {resource.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.content}>
      <div className={styles.Topline}>
            <button onClick={handleButtonClick}>Help</button>
        </div>
        <div className={styles.textPart}>
        <h1>{detailData?.name}</h1>
        <p>
          <strong>上游 URL:</strong>{' '}
          <a
            href={detailData?.upstream_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.url}
          >
            {detailData?.upstream_url}
          </a>
        </p>
        <div className={styles.workers}>
        <h3>Workers</h3>
        <table>
  <thead>
    <tr>
      <th>名稱</th>
      <th>副本ID</th>
      <th>提供方法</th>
      <th>狀態</th>
    </tr>
  </thead>
  <tbody>
    {detailData?.workers?.map((worker, index) => (
      <tr key={index}>
        <td>{worker.name}</td>
        <td>{worker.replica_id}</td>
        <td>{worker.provider_method}</td>
        <td>{worker.status}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
      </div>
    </div>
    </div>
  );
};

export default DetailSection;
