import React, {useEffect, useState} from 'react';
import MarkdownIt from 'markdown-it';
import styles from './styles.module.scss';
// 安装 @types/markdown-it 后，可以导入类型

type Announcement = {
  id: number;
  data: {
    title: string;
    content: string;
    date: string;
  };
};

const md = new MarkdownIt();

const AdSection: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement[]>([]); // 状态变量与更新函数，状态变化会触发重新渲染

  useEffect(() => {
    // 从后端获取公告数据
    fetch('http://127.0.0.1:4523/m1/5454758-5129914-default/api/announcement')
      .then(async response => response.json())
      .then(data => {
        setAnnouncement(data as Announcement[]);
      })
      .catch((error: unknown) => {
        console.error('获取公告失败:', error);
      });
  }, []); // 依赖项为空，只在组件挂载时执行一次

  return (
    <div className={styles.AdSection}>
      <h1 className={styles.Title}><strong>公告</strong></h1>
      {announcement.length > 0 ? (
        <ul className={styles.bottom}>
          {announcement.map(item => (
            <li key={item.id} className={styles.announcementBox}>
              <h2 className={styles.title}>{item.data.title}</h2>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: md.render(item.data.content),
                }}
              ></div>
              <small>{item.data.date}</small>

            </li>
          ))}
        </ul>
      ) : (
        <p>暂无公告</p>
      )}
    </div>
  );
};

export default AdSection;
