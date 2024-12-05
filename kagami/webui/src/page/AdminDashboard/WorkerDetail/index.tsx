import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkerList, acceptWorker, deleteWorker, getWorkerResource, addProvider } from '../../../api/admin';
import FirstSection from '../../IntroductionPage/FirstSection';
import styles from './styles.module.scss';

interface WorkerResource {
  cpu: number;
  memory: number;
  storage: number;
}

interface Worker {
  address: string;
  status: string;
  resources: WorkerResource;
}

interface ResourceInfo {
  name: string;
  status: string;
  providers: {
    name: string;
    method: string;
    status: string;
    upstream_url: string;
  }[];
}

interface NewProvider {
  name: string;
  method: string;
  upstream_url: string;
}

const WorkerDetail: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [newProvider, setNewProvider] = useState<NewProvider>({
    name: '',
    method: '',
    upstream_url: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取worker信息
  useEffect(() => {
    const fetchWorkerInfo = async () => {
      try {
        const workerList = await getWorkerList();
        const currentWorker = workerList.find(w => w.address === address);
        if (currentWorker) {
          setWorker(currentWorker);
        }
      } catch (error) {
        console.error('Failed to fetch worker info:', error);
      }
    };
    fetchWorkerInfo();
  }, [address]);

  // 获取worker的资源信息
  useEffect(() => {
    const fetchWorkerResource = async () => {
      if (!address) return;
      try {
        const resourcesData = await getWorkerResource(address);
        setResources(resourcesData);
      } catch (error: any) {
        console.error('Failed to fetch worker resources:', error);
        // TODO: 可以在这里添加错误提示UI
        setResources([]); // 设置为空数组，避免undefined
      }
    };
    fetchWorkerResource();
  }, [address]);

  // 处理添加 provider
  const handleAddProvider = async () => {
    if (!address || !selectedResource) return;

    // Validate form
    if (!newProvider.name.trim()) {
      alert('Provider name is required');
      return;
    }
    if (!newProvider.method.trim()) {
      alert('Sync method is required');
      return;
    }
    if (!newProvider.upstream_url.trim()) {
      alert('Upstream URL is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const request = {
        resource_name: selectedResource,
        provider: {
          name: newProvider.name,
          method: newProvider.method,
          upstream_url: newProvider.upstream_url
        }
      };
      
      console.log('Adding provider with request:', request);
      await addProvider(address, request);
      console.log('Provider added successfully');

      // 重新获取资源信息并更新状态
      console.log('Fetching updated resources...');
      const updatedResources = await getWorkerResource(address);
      console.log('Updated resources:', updatedResources);
      
      if (updatedResources && Array.isArray(updatedResources)) {
        setResources(updatedResources);
        setShowAddModal(false);
        setNewProvider({ name: '', method: '', upstream_url: '' });
      } else {
        console.error('Invalid resources data:', updatedResources);
        throw new Error('Failed to get updated resources');
      }
    } catch (error) {
      console.error('Failed to add provider:', error);
      alert('Failed to add provider. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 删除worker
  const handleDeleteWorker = async () => {
    if (!address) return;
    
    // 添加确认对话框
    const confirmed = window.confirm('Are you sure you want to delete this worker? This action cannot be undone.');
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await deleteWorker(address);
      // 删除成功后跳转到dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Failed to delete worker:', error);
      alert('Failed to delete worker. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 接受worker
  const handleAcceptWorker = async () => {
    if (!address) return;
    setIsSubmitting(true);
    try {
      await acceptWorker(address);
      // 更新本地状态而不是刷新页面
      setWorker(prev => prev ? { ...prev, status: 'active' } : null);
      // 重新获取最新的 worker 资源信息
      const resourcesData = await getWorkerResource(address);
      setResources(resourcesData);
    } catch (error) {
      console.error('Failed to accept worker:', error);
      alert('Failed to accept worker. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!worker) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.firstSection}>
        <FirstSection showNav={false} />
      </div>
      <div className={styles.backgroundCard}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2>Worker Details</h2>
            <div className={styles.actions}>
              {worker.status === 'pending' && (
                <button 
                  className={styles.acceptButton}
                  onClick={handleAcceptWorker}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Accepting...' : 'Accept Worker'}
                </button>
              )}
              <button 
                className={styles.deleteButton}
                onClick={handleDeleteWorker}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Worker'}
              </button>
            </div>
          </div>

          <div className={styles.mainSection}>
            <div className={styles.infoCard}>
              <h3>Basic Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.label}>Address:</div>
                  <div className={styles.value}>{worker.address}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.label}>Status:</div>
                  <div className={`${styles.value} ${styles[worker.status]}`}>
                    {worker.status}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.label}>CPU:</div>
                  <div className={styles.value}>{worker.resources.cpu} cores</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.label}>Memory:</div>
                  <div className={styles.value}>{worker.resources.memory} GB</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.label}>Storage:</div>
                  <div className={styles.value}>{worker.resources.storage} GB</div>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.resourceHeader}>
                <h3>Mirror Resources</h3>
                <div className={styles.resourceHeaderActions}>
                  <button 
                    className={styles.resourceButton}
                    onClick={() => {
                      setShowAddModal(true);
                    }}
                  >
                    Add provider
                  </button>
                </div>
              </div>
              <div className={styles.resourcesGrid}>
                {resources.map((resource, index) => (
                  <div key={index} className={styles.resourceCard}>
                    <div className={styles.resourceHeader}>
                      <h4>{resource.name}</h4>
                      <div className={styles.resourceHeaderActions}>
                        <span className={`${styles.status} ${styles[resource.status]}`}>
                          {resource.status}
                        </span>
                      </div>
                    </div>
                    <div className={styles.providersContainer}>
                      {resource.providers.map((provider, pIndex) => (
                        <div key={pIndex} className={styles.provider}>
                          <div className={styles.providerHeader}>
                            <span className={styles.providerName}>{provider.name}</span>
                            <span className={`${styles.status} ${styles[provider.status]}`}>
                              {provider.status}
                            </span>
                          </div>
                          <div className={styles.providerDetails}>
                            <div className={styles.detailItem}>
                              <span className={styles.label}>Method:</span>
                              <span className={styles.value}>{provider.method}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.label}>Upstream:</span>
                              <span className={styles.value}>{provider.upstream_url}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Add Provider</h3>
              <div className={styles.resourceForm}>
                <div className={styles.formGroup}>
                  <label>Select Resource:</label>
                  <select
                    value={selectedResource}
                    onChange={(e) => setSelectedResource(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select a resource</option>
                    {resources.map((resource, index) => (
                      <option key={index} value={resource.name}>
                        {resource.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Provider Name:</label>
                  <input
                    type="text"
                    value={newProvider.name}
                    onChange={(e) => setNewProvider({
                      ...newProvider,
                      name: e.target.value
                    })}
                    placeholder="e.g., tuna"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Sync Method:</label>
                  <input
                    type="text"
                    value={newProvider.method}
                    onChange={(e) => setNewProvider({
                      ...newProvider,
                      method: e.target.value
                    })}
                    placeholder="e.g., rsync"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Upstream URL:</label>
                  <input
                    type="text"
                    value={newProvider.upstream_url}
                    onChange={(e) => setNewProvider({
                      ...newProvider,
                      upstream_url: e.target.value
                    })}
                    placeholder="e.g., rsync://mirrors.tuna.tsinghua.edu.cn/ubuntu/"
                  />
                </div>
                <div className={styles.modalActions}>
                  <button 
                    className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                    onClick={handleAddProvider}
                    disabled={isSubmitting}
                    aria-label="Add provider"
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowAddModal(false);
                      setNewProvider({ name: '', method: '', upstream_url: '' });
                    }}
                    aria-label="Cancel adding provider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDetail;
