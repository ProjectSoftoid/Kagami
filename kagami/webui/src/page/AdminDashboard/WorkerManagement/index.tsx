import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkerList } from '../../../api/admin';
import styles from './styles.module.scss';

interface WorkerResource {
  cpu: number;
  memory: number;
  storage: number;
}

interface Worker {
  address: string;
  status: 'pending' | 'active' | 'offline';
  resources: WorkerResource;
}

const WorkerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);

  // 获取worker列表
  const fetchWorkers = async () => {
    try {
      const workerList = await getWorkerList();
      setWorkers(workerList);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    }
  };

  // 跳转到worker详情页
  const handleWorkerClick = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    navigate(`/admin/worker/${encodedAddress}`);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Worker Management</h2>
      
      <div className={styles.workerList}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Worker Address</th>
              <th>Status</th>
              <th>CPU</th>
              <th>Memory</th>
              <th>Storage</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker, index) => (
              <tr 
                key={`${worker.address}-${index}`} 
                className={styles.workerRow}
                onClick={() => handleWorkerClick(worker.address)}
              >
                <td>{worker.address}</td>
                <td>
                  <span className={`${styles.status} ${styles[worker.status]}`}>
                    {worker.status}
                  </span>
                </td>
                <td>{worker.resources.cpu}</td>
                <td>{worker.resources.memory} GB</td>
                <td>{worker.resources.storage} GB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerManagement;
