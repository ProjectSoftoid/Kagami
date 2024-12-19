import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { getHelper, type Helper } from '../../api/helper';
import { ResourceInfo, getResource } from '../../api/resourceInfo';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const HelpSection: React.FC = () => {
  const { resource_name } = useParams<{ resource_name: string }>();
  const navigate = useNavigate();
  const [helperData, setHelperData] = useState<Helper[]>([]);
  const [helperLoading, setHelperLoading] = useState(true);
  const [helperError, setHelperError] = useState<string | null>(null);
  const [resourceList, setResourceList] = useState<ResourceInfo[]>([]);
  const [resourceLoading, setResourceLoading] = useState(true);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);

  useEffect(() => {
    const fetchHelperData = async (resourceName: string) => {
      try {
        const data = await getHelper(resourceName);
        setHelperData(data);
        // Find the helper that matches the resource_name
        const selected = data.find(helper => helper.name.toLowerCase() === resourceName.toLowerCase());
        setSelectedHelper(selected || null);
        setHelperError(null);
      } catch (err) {
        console.error('加载帮助数据失败:', err);
        setHelperError('加载帮助文档失败，请稍后再试。');
      } finally {
        setHelperLoading(false);
      }
    };

    if (resource_name) {
      fetchHelperData(resource_name);
    }
  }, [resource_name]);

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
      } finally {
        setResourceLoading(false);
      }
    };

    fetchResourceList();
  }, []);

  if (helperLoading || resourceLoading) {
    return <p>加载中...</p>;
  }

  if (helperError) {
    return <p>{helperError}</p>;
  }

  if (resourceError) {
    return <p>{resourceError}</p>;
  }

  const handleButtonClick1 = () => {
    navigate(`/helper/${resource_name}/detail`);
  };

  return (
    <div className={styles.HelpPage}>
      <div className={styles.sidebar}>
        <h2>选择</h2>
        <ul>
          {resourceList.map((resource) => (
            <li key={resource.name} className={styles.name}>
              <Link to={`/helper/${resource.name}`} className={styles.name}>
                {resource.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.content}>
        <div className={styles.Topline}>
          <button onClick={handleButtonClick1}>Detail</button>
        </div>
        <div className={styles.textPart}>
          {selectedHelper && (
            <div>
              <h1>{selectedHelper.name}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(selectedHelper.content),
                }}
              ></div>
              <p className={styles.lastUpdate}>
                Last updated: {new Date(parseInt(selectedHelper.last_update)).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
