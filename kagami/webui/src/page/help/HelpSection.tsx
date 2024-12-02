import React, { useEffect, useState } from 'react';
import { useParams,Link,useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { getHelper, type Helper } from '../../api/helper';
import { ResourceInfo, getResource } from '../../api/resourceInfo';
import MarkdownIt from 'markdown-it';


const md = new MarkdownIt();

const HelpSection: React.FC = () => {
  const { resource_name } = useParams<{ resource_name: string }>(); // 获取路由参数
  const navigate = useNavigate();
  const [helperData, setHelperData] = useState<Helper | null>(null); // 帮助文档数据
  const [helperLoading, setHelperLoading] = useState(true); // 帮助文档加载状态
  const [helperError, setHelperError] = useState<string | null>(null); // 帮助文档加载错误
  const [resourceList, setResourceList] = useState<ResourceInfo[]>([]); // 资源列表
  const [resourceLoading, setResourceLoading] = useState(true); // 资源列表加载状态
  const [resourceError, setResourceError] = useState<string | null>(null); // 资源列表加载错误

  // 加载帮助文档
  useEffect(() => {
    const fetchHelperData = async (resourceName: string) => {
      try {
        const data = await getHelper(resourceName);
        setHelperData(data);
        setHelperError(null);
      } catch (err) {
        console.error('加载帮助数据失败:', err);
        setHelperError('加载帮助文档失败，请稍后再试。');
      } finally {
        setHelperLoading(false); // 停止加载状态
      }
    };

    if (resource_name) {
      fetchHelperData(resource_name);
    }
  }, [resource_name]); // 当 resource_name 变化时重新加载数据

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
      } finally {
        setResourceLoading(false); // 停止加载状态
      }
    };

    fetchResourceList();
  }, []); // 仅在组件挂载时执行一次
  /*useEffect(()=>{
    const fetchResourceDetail = async () => {
        try {

        }
  } })*/


  // 渲染加载中状态
  if (helperLoading || resourceLoading) {
    return <p>加载中...</p>;
  }

  // 渲染错误状态
  if (helperError) {
    return <p>{helperError}</p>;
  }

  if (resourceError) {
    return <p>{resourceError}</p>;
  }
  const handleButtonClick1 = () => {
    navigate(`/helper/${resource_name}/detail`); // 跳转到 detail 路径
  };
  // 渲染页面内容
  return (
    <div className={styles.HelpPage}>
      <div className={styles.sidebar}>
        <h2>选择</h2>
        <ul>
          {resourceList.map((resource) => (

            <li key={resource.name} className={styles.name} >
             <Link to = {`/helper/${resource.name}`} className={styles.name}>
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
        <h1>{helperData?.title}</h1>

        {/* 使用 dangerouslySetInnerHTML 渲染 Markdown */}
        <div
          dangerouslySetInnerHTML={{
            __html: helperData ? md.render(helperData.content) : '',
          }}
        ></div>
        <div className={styles.examples}>
          <h3>示例</h3>
          <ul>
            {helperData?.examples.map((example, index) => (
              <li key={index}>
                <code>{example}</code> {/* 渲染代码块样式 */}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.links}>
          <h3>相关链接</h3>
          <ul>
            {helperData?.links.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
    </div>

  );
};

export default HelpSection;
