import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col } from 'antd';
import * as echarts from 'echarts';
import styles from './style.module.scss';
import { getSystemMonitor, getNetworkMonitor, getDiskMonitor } from '../../api/monitor';
import type { SystemMonitorData, NetworkMonitorData, DiskMonitorData } from '../../api/monitor';
import FirstSection from '../IntroductionPage/FirstSection';
import ThirdSection from '../IntroductionPage/ThirdSection';
import DiskMonitor from './components/DiskMonitor';

interface ChartData {
  times: string[];
  cpuUser: number[];
  cpuSystem: number[];
  cpuIdle: number[];
  cpuIowait: number[];
  memoryUsed: number[];
  memoryFree: number[];
  memoryCached: number[];
  memoryBuffered: number[];
  ipv4Http: number[];
  ipv4Https: number[];
  ipv4Rsync: number[];
  ipv6Http: number[];
  ipv6Https: number[];
  ipv6Rsync: number[];
  diskRead: number[];
  diskWrite: number[];
  diskUsage: number[];
}

const StatePage: React.FC = () => {
  const [monitorData, setMonitorData] = useState<SystemMonitorData | null>(null);
  const [networkData, setNetworkData] = useState<NetworkMonitorData | null>(null);
  const [diskData, setDiskData] = useState<DiskMonitorData | null>(null);
  const cpuChartRef = useRef<HTMLDivElement>(null);
  const memoryChartRef = useRef<HTMLDivElement>(null);
  const ipv4ChartRef = useRef<HTMLDivElement>(null);
  const ipv6ChartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<ChartData>({
    times: [],
    cpuUser: [],
    cpuSystem: [],
    cpuIdle: [],
    cpuIowait: [],
    memoryUsed: [],
    memoryFree: [],
    memoryCached: [],
    memoryBuffered: [],
    ipv4Http: [],
    ipv4Https: [],
    ipv4Rsync: [],
    ipv6Http: [],
    ipv6Https: [],
    ipv6Rsync: [],
    diskRead: [],
    diskWrite: [],
    diskUsage: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sysResponse, netResponse, diskResponse] = await Promise.all([
          getSystemMonitor(),
          getNetworkMonitor(),
          getDiskMonitor()
        ]);

        if (sysResponse.data.code === 200) {
          setMonitorData(sysResponse.data.data);
        }
        if (netResponse.data.code === 200) {
          setNetworkData(netResponse.data.data);
        }
        if (diskResponse.data.code === 200) {
          setDiskData(diskResponse.data.data);
        }

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setChartData(prev => {
          const maxPoints = 288; // 24 hours of data points (5-minute intervals)
          const newData = { ...prev };

          // Update time and existing metrics
          newData.times = [...prev.times, currentTime].slice(-maxPoints);
          
          if (sysResponse.data.code === 200) {
            newData.cpuUser = [...prev.cpuUser, sysResponse.data.data.cpu.user].slice(-maxPoints);
            newData.cpuSystem = [...prev.cpuSystem, sysResponse.data.data.cpu.system].slice(-maxPoints);
            newData.cpuIdle = [...prev.cpuIdle, sysResponse.data.data.cpu.idle].slice(-maxPoints);
            newData.cpuIowait = [...prev.cpuIowait, sysResponse.data.data.cpu.iowait].slice(-maxPoints);
            newData.memoryUsed = [...prev.memoryUsed, sysResponse.data.data.memory.used / 1024].slice(-maxPoints);
            newData.memoryFree = [...prev.memoryFree, sysResponse.data.data.memory.free / 1024].slice(-maxPoints);
            newData.memoryCached = [...prev.memoryCached, sysResponse.data.data.memory.cached / 1024].slice(-maxPoints);
            newData.memoryBuffered = [...prev.memoryBuffered, sysResponse.data.data.memory.buffered / 1024].slice(-maxPoints);
          }

          if (netResponse.data.code === 200) {
            const ipv4Services = netResponse.data.data.ipv4.services;
            const ipv6Services = netResponse.data.data.ipv6.services;

            newData.ipv4Http = [...prev.ipv4Http, ipv4Services.find(s => s.name === 'kagami-http-ipv4')?.traffic.current || 0].slice(-maxPoints);
            newData.ipv4Https = [...prev.ipv4Https, ipv4Services.find(s => s.name === 'kagami-https-ipv4')?.traffic.current || 0].slice(-maxPoints);
            newData.ipv4Rsync = [...prev.ipv4Rsync, ipv4Services.find(s => s.name === 'kagami-rsync-ipv4')?.traffic.current || 0].slice(-maxPoints);
            newData.ipv6Http = [...prev.ipv6Http, ipv6Services.find(s => s.name === 'kagami-http-ipv6')?.traffic.current || 0].slice(-maxPoints);
            newData.ipv6Https = [...prev.ipv6Https, ipv6Services.find(s => s.name === 'kagami-https-ipv6')?.traffic.current || 0].slice(-maxPoints);
            newData.ipv6Rsync = [...prev.ipv6Rsync, ipv6Services.find(s => s.name === 'kagami-rsync-ipv6')?.traffic.current || 0].slice(-maxPoints);
          }

          if (diskResponse.data.code === 200 && diskResponse.data.data.disks.length > 0) {
            const disk = diskResponse.data.data.disks[0];
            newData.diskRead = [...prev.diskRead, disk.read_throughput].slice(-maxPoints);
            newData.diskWrite = [...prev.diskWrite, disk.write_throughput].slice(-maxPoints);
            newData.diskUsage = [...prev.diskUsage, disk.usage].slice(-maxPoints);
          }

          return newData;
        });
      } catch (error) {
        console.error('Failed to fetch monitor data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!monitorData || !networkData || !diskData || !cpuChartRef.current || !memoryChartRef.current || !ipv4ChartRef.current || !ipv6ChartRef.current) return;

    // 共用的图表配置
    const commonChartConfig = {
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        top: 30,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.65)'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.65)',
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
          color: 'rgba(255, 255, 255, 0.65)'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    };

    const createSeriesConfig = (name: string, data: number[], color: string) => ({
      name,
      type: 'line',
      stack: 'Total',
      areaStyle: { opacity: 0.3 },
      emphasis: { focus: 'series' },
      data,
      itemStyle: { color },
      lineStyle: { width: 1 }
    });

    // CPU Usage Chart
    const cpuChart = echarts.init(cpuChartRef.current);
    const cpuOption = {
      ...commonChartConfig,
      title: {
        text: 'CPU Usage',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 500
        }
      },
      xAxis: {
        ...commonChartConfig.xAxis,
        data: chartData.times,
        axisLabel: {
          ...commonChartConfig.xAxis.axisLabel,
          interval: Math.floor(chartData.times.length / 8)
        }
      },
      yAxis: {
        ...commonChartConfig.yAxis,
        max: 100,
        axisLabel: {
          ...commonChartConfig.yAxis.axisLabel,
          formatter: '{value}%'
        }
      },
      series: [
        createSeriesConfig('User', chartData.cpuUser, '#5470c6'),
        createSeriesConfig('System', chartData.cpuSystem, '#91cc75'),
        createSeriesConfig('I/O Wait', chartData.cpuIowait, '#fac858'),
        createSeriesConfig('Idle', chartData.cpuIdle, '#ee6666')
      ]
    };
    cpuChart.setOption(cpuOption);

    // Memory Usage Chart
    const memoryChart = echarts.init(memoryChartRef.current);
    const memoryOption = {
      ...commonChartConfig,
      title: {
        text: 'Memory Usage',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 500
        }
      },
      xAxis: {
        ...commonChartConfig.xAxis,
        data: chartData.times,
        axisLabel: {
          ...commonChartConfig.xAxis.axisLabel,
          interval: Math.floor(chartData.times.length / 8)
        }
      },
      yAxis: {
        ...commonChartConfig.yAxis,
        axisLabel: {
          ...commonChartConfig.yAxis.axisLabel,
          formatter: '{value} GB'
        }
      },
      series: [
        createSeriesConfig('Used', chartData.memoryUsed, '#5470c6'),
        createSeriesConfig('Cached', chartData.memoryCached, '#91cc75'),
        createSeriesConfig('Buffered', chartData.memoryBuffered, '#fac858'),
        createSeriesConfig('Free', chartData.memoryFree, '#ee6666')
      ]
    };
    memoryChart.setOption(memoryOption);

    // IPv4 Traffic Chart
    const ipv4Chart = echarts.init(ipv4ChartRef.current);
    const ipv4Option = {
      ...commonChartConfig,
      title: {
        text: 'IPv4 Service Traffic',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 500
        }
      },
      xAxis: {
        ...commonChartConfig.xAxis,
        data: chartData.times,
        axisLabel: {
          ...commonChartConfig.xAxis.axisLabel,
          interval: Math.floor(chartData.times.length / 8)
        }
      },
      yAxis: {
        ...commonChartConfig.yAxis,
        axisLabel: {
          ...commonChartConfig.yAxis.axisLabel,
          formatter: '{value} Gb/s'
        }
      },
      series: [
        createSeriesConfig('HTTP', chartData.ipv4Http, '#5470c6'),
        createSeriesConfig('HTTPS', chartData.ipv4Https, '#91cc75'),
        createSeriesConfig('RSYNC', chartData.ipv4Rsync, '#fac858')
      ]
    };
    ipv4Chart.setOption(ipv4Option);

    // IPv6 Traffic Chart
    const ipv6Chart = echarts.init(ipv6ChartRef.current);
    const ipv6Option = {
      ...commonChartConfig,
      title: {
        text: 'IPv6 Service Traffic',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 500
        }
      },
      xAxis: {
        ...commonChartConfig.xAxis,
        data: chartData.times,
        axisLabel: {
          ...commonChartConfig.xAxis.axisLabel,
          interval: Math.floor(chartData.times.length / 8)
        }
      },
      yAxis: {
        ...commonChartConfig.yAxis,
        axisLabel: {
          ...commonChartConfig.yAxis.axisLabel,
          formatter: '{value} Gb/s'
        }
      },
      series: [
        createSeriesConfig('HTTP', chartData.ipv6Http, '#5470c6'),
        createSeriesConfig('HTTPS', chartData.ipv6Https, '#91cc75'),
        createSeriesConfig('RSYNC', chartData.ipv6Rsync, '#fac858')
      ]
    };
    ipv6Chart.setOption(ipv6Option);

    const handleResize = () => {
      requestAnimationFrame(() => {
        cpuChart.resize();
        memoryChart.resize();
        ipv4Chart.resize();
        ipv6Chart.resize();
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cpuChart.dispose();
      memoryChart.dispose();
      ipv4Chart.dispose();
      ipv6Chart.dispose();
    };
  }, [monitorData, networkData, diskData, chartData]);

  if (!monitorData || !networkData || !diskData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.statePage}>
      <FirstSection />
      <div className={styles.monitorContainer}>
        <div className={styles.monitorHeader}>
          <div className={styles.title}>服务器监控</div>
        </div>
        <div className={styles.monitorContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>网络流量</div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} className={styles.card}>
                  <div ref={ipv4ChartRef} style={{ height: '300px', width: '100%' }} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} className={styles.card}>
                  <div ref={ipv6ChartRef} style={{ height: '300px', width: '100%' }} />
                </Card>
              </Col>
            </Row>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>CPU / 内存</div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} className={styles.card}>
                  <div ref={cpuChartRef} style={{ height: '300px', width: '100%' }} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} className={styles.card}>
                  <div ref={memoryChartRef} style={{ height: '300px', width: '100%' }} />
                </Card>
              </Col>
            </Row>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>磁盘状态</div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <DiskMonitor
                  data={{
                    times: chartData.times,
                    read: chartData.diskRead,
                    write: chartData.diskWrite,
                    usage: chartData.diskUsage[chartData.diskUsage.length - 1]
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <ThirdSection />
    </div>
  );
};

export default StatePage;
