import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { getVisitStatistics, Statistics } from '../../../api/statistics';
import { getUserUsageList, User } from '../../../api/users';
import styles from './styles.module.scss';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const activeUsersChartRef = React.useRef<HTMLDivElement>(null);
  const trafficChartRef = React.useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<{
    times: string[];
    activeUsers: number[];
    traffic: number[];
  }>({
    times: [],
    activeUsers: [],
    traffic: []
  });

  // 获取用户数据
  const fetchUsers = async () => {
    try {
      const response = await getUserUsageList();
      if (response.data.code === 200) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await getVisitStatistics();
      console.log('API Response:', JSON.stringify(response, null, 2));
      if (response.code === 200) { 
        setStatistics(response.data);
        
        const currentTime = new Date(response.data.timestamp);
        const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setChartData(prev => {
          const newTimes = [...prev.times, timeStr];
          const newActiveUsers = [...prev.activeUsers, response.data.metrics.active_users];
          const newTraffic = [...prev.traffic, response.data.metrics.total_traffic];
          
          // Keep data for the last 24 hours (assuming 5-minute intervals)
          const maxPoints = (24 * 60) / 5; // 288 points for 24 hours
          
          return {
            times: newTimes.slice(-maxPoints),
            activeUsers: newActiveUsers.slice(-maxPoints),
            traffic: newTraffic.slice(-maxPoints)
          };
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchStatistics()]);
    };

    // Initial fetch
    fetchData();

    // Set up auto-refresh every 5 seconds
    const timer = setInterval(fetchData, 5000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!statistics || !activeUsersChartRef.current || !trafficChartRef.current) return;

    // 活跃用户图表
    const activeUsersChart = echarts.init(activeUsersChartRef.current);
    const activeUsersOption = {
      title: {
        text: '实时活跃用户',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      grid: {
        top: 50,
        right: 20,
        bottom: 40,
        left: 50,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        type: 'slider',
        show: true,
        bottom: 5,
        height: 20,
        borderColor: 'transparent',
        backgroundColor: 'rgba(255,255,255,0.1)',
        fillerColor: 'rgba(255,255,255,0.2)',
        handleStyle: {
          color: '#1890ff'
        }
      }],
      xAxis: {
        type: 'category',
        data: chartData.times,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          interval: Math.floor(chartData.times.length / 8),
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [{
        data: chartData.activeUsers,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#1890ff',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24, 144, 255, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(24, 144, 255, 0)'
            }
          ])
        }
      }]
    };
    activeUsersChart.setOption(activeUsersOption);

    // 流量图表
    const trafficChart = echarts.init(trafficChartRef.current);
    const trafficOption = {
      title: {
        text: '实时流量统计',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      grid: {
        top: 50,
        right: 20,
        bottom: 40,
        left: 50,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        formatter: function(params: any) {
          const value = params[0].value;
          return `${params[0].name}<br/>${formatTraffic(value)}`;
        }
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        type: 'slider',
        show: true,
        bottom: 5,
        height: 20,
        borderColor: 'transparent',
        backgroundColor: 'rgba(255,255,255,0.1)',
        fillerColor: 'rgba(255,255,255,0.2)',
        handleStyle: {
          color: '#52c41a'
        }
      }],
      xAxis: {
        type: 'category',
        data: chartData.times,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          interval: Math.floor(chartData.times.length / 8),
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          formatter: function(value: number) {
            return formatTraffic(value);
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [{
        data: chartData.traffic,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#52c41a',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(82, 196, 26, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(82, 196, 26, 0)'
            }
          ])
        }
      }]
    };
    trafficChart.setOption(trafficOption);

    const handleResize = () => {
      activeUsersChart.resize();
      trafficChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      activeUsersChart.dispose();
      trafficChart.dispose();
    };
  }, [statistics, chartData]);

  // 计算系统总览数据
  const overview = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    totalTraffic: users.reduce((sum, u) => sum + u.traffic_used, 0),
    totalConnections: users.reduce((sum, u) => sum + u.current_connections, 0)
  };

  const formatTraffic = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.contentTitle}>用戶監控</h2>
      
      <div className={styles.statsContainer}>
        <div className={styles.statsItem}>
          <div className={styles.statsLabel}>总用户数</div>
          <div className={styles.statsValue}>{overview.totalUsers}</div>
        </div>
        <div className={styles.statsItem}>
          <div className={styles.statsLabel}>在线用户</div>
          <div className={styles.statsValue}>{overview.activeUsers}</div>
        </div>
        <div className={styles.statsItem}>
          <div className={styles.statsLabel}>总流量</div>
          <div className={styles.statsValue}>{formatTraffic(overview.totalTraffic)}</div>
        </div>
        <div className={styles.statsItem}>
          <div className={styles.statsLabel}>总连接数</div>
          <div className={styles.statsValue}>{overview.totalConnections}</div>
        </div>
      </div>

      <div className={styles.graphContainer}>
        <div className={styles.graph} ref={activeUsersChartRef}>
        </div>
        <div className={styles.graph} ref={trafficChartRef}>
        </div>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>用户名</th>
            <th>状态</th>
            <th>连接数</th>
            <th>流量使用</th>
            <th>最后活跃</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.username}</td>
              <td>{user.is_active ? '在线' : '离线'}</td>
              <td>{user.current_connections}</td>
              <td>{formatTraffic(user.traffic_used)}</td>
              <td>{formatLastActive(user.last_active)}</td>
              <td>
                <button className={styles.actionButton}>并发限制</button>
                <button className={styles.actionButton}>流量限制</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
