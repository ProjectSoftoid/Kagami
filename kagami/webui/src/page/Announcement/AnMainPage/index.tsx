import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import { getAnnouncements, type Announcement } from '../../../api/announcement';
import styles from './styles.module.scss';
// 安装 @types/markdown-it 后，可以导入类型

const md = new MarkdownIt();

const AdSection: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement[]>([]); // 状态变量与更新函数，状态变化会触发重新渲染

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncement(data);
      } catch (error) {
        console.error('加载失败公告:', error);
      }
    };

    fetchAnnouncement();
  }, []);

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