import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { timeStamp } from "console";
// temprary content， modify later
const DownloadPage =() => {
  <div>
    <div className={styles.downloadPage}>
      <div className={styles.downloadSection}>
        <h2>下载</h2>
        <p>请根据您的需求选择合适的下载方式</p>
        <div className={styles.downloadLinks}>
          <a href="https://mirrors.kagami.must.edu.cn" className={styles.downloadLink}>
            <span>自动选择</span>
            <span>https://mirrors.kagami.must.edu.cn</span>
          </a>
          <a href="https://mirrors6.kagami.must.edu.cn" className={styles.downloadLink}>
            <span>IPv4</span>
            <span>https://mirrors6.kagami.must.edu.cn</span>
          </a>
          <a href="https://mirrors4.kagami.must.edu.cn" className={styles.downloadLink}>
            <span>IPv6</span>
            <span>https://mirrors4.kagami.must.edu.cn</span>
          </a>
        </div>
      </div>
    </div>
  </div>

}

export default DownloadPage;
