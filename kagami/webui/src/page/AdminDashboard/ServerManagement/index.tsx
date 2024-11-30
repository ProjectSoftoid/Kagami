import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col } from 'antd';
import * as echarts from 'echarts';
import styles from './style.module.scss';
import { getSystemMonitor, getNetworkMonitor, getDiskMonitor } from '../../../api/monitor';
import type { SystemMonitorData, NetworkMonitorData, DiskMonitorData } from '../../../api/monitor';
import DiskMonitor from '../../State/components/DiskMonitor';

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

const ServerManagement: React.FC = () => {
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
          const maxPoints = 288;
          const newData = { ...prev };
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

          if (diskResponse.data.code === 200) {
            const disk = diskResponse.data.data.disks[0];
            newData.diskRead = [...prev.diskRead, disk.read_throughput].slice(-maxPoints);
            newData.diskWrite = [...prev.diskWrite, disk.write_throughput].slice(-maxPoints);
            newData.diskUsage = [...prev.diskUsage, disk.usage].slice(-maxPoints);
          }

          return newData;
        });
      } catch (error) {
        console.error('Error fetching monitor data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initCharts = () => {
      if (cpuChartRef.current && memoryChartRef.current && ipv4ChartRef.current && ipv6ChartRef.current) {
        const charts = {
          cpu: echarts.init(cpuChartRef.current),
          memory: echarts.init(memoryChartRef.current),
          ipv4: echarts.init(ipv4ChartRef.current),
          ipv6: echarts.init(ipv6ChartRef.current)
        };

        const commonConfig = {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 60,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.times,
            axisLabel: { color: '#fff' },
            axisLine: { lineStyle: { color: '#fff' } }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: { backgroundColor: '#6a7985' }
            }
          }
        };

        charts.cpu.setOption({
          ...commonConfig,
          title: {
            text: 'CPU使用率',
            textStyle: { color: '#fff', fontSize: 14 }
          },
          legend: {
            data: ['User', 'System', 'Idle', 'IOWait'],
            textStyle: { color: '#fff' },
            top: 25
          },
          yAxis: {
            type: 'value',
            name: '%',
            max: 100,
            nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
            axisLine: { lineStyle: { color: '#fff' } }
          },
          series: [
            { name: 'User', type: 'line', data: chartData.cpuUser, smooth: true },
            { name: 'System', type: 'line', data: chartData.cpuSystem, smooth: true },
            { name: 'Idle', type: 'line', data: chartData.cpuIdle, smooth: true },
            { name: 'IOWait', type: 'line', data: chartData.cpuIowait, smooth: true }
          ]
        });

        charts.memory.setOption({
          ...commonConfig,
          title: {
            text: '内存使用情况',
            textStyle: { color: '#fff', fontSize: 14 }
          },
          legend: {
            data: ['Used', 'Free', 'Cached', 'Buffered'],
            textStyle: { color: '#fff' },
            top: 25
          },
          yAxis: {
            type: 'value',
            name: 'GB',
            nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
            axisLine: { lineStyle: { color: '#fff' } }
          },
          series: [
            { name: 'Used', type: 'line', data: chartData.memoryUsed, smooth: true },
            { name: 'Free', type: 'line', data: chartData.memoryFree, smooth: true },
            { name: 'Cached', type: 'line', data: chartData.memoryCached, smooth: true },
            { name: 'Buffered', type: 'line', data: chartData.memoryBuffered, smooth: true }
          ]
        });

        charts.ipv4.setOption({
          ...commonConfig,
          title: {
            text: 'IPv4 流量',
            textStyle: { color: '#fff', fontSize: 14 }
          },
          legend: {
            data: ['HTTP', 'HTTPS', 'RSYNC'],
            textStyle: { color: '#fff' },
            top: 25
          },
          yAxis: {
            type: 'value',
            name: 'Connections',
            nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
            axisLine: { lineStyle: { color: '#fff' } }
          },
          series: [
            { name: 'HTTP', type: 'line', data: chartData.ipv4Http, smooth: true },
            { name: 'HTTPS', type: 'line', data: chartData.ipv4Https, smooth: true },
            { name: 'RSYNC', type: 'line', data: chartData.ipv4Rsync, smooth: true }
          ]
        });

        charts.ipv6.setOption({
          ...commonConfig,
          title: {
            text: 'IPv6 流量',
            textStyle: { color: '#fff', fontSize: 14 }
          },
          legend: {
            data: ['HTTP', 'HTTPS', 'RSYNC'],
            textStyle: { color: '#fff' },
            top: 25
          },
          yAxis: {
            type: 'value',
            name: 'Connections',
            nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
            axisLine: { lineStyle: { color: '#fff' } }
          },
          series: [
            { name: 'HTTP', type: 'line', data: chartData.ipv6Http, smooth: true },
            { name: 'HTTPS', type: 'line', data: chartData.ipv6Https, smooth: true },
            { name: 'RSYNC', type: 'line', data: chartData.ipv6Rsync, smooth: true }
          ]
        });

        const handleResize = () => {
          Object.values(charts).forEach(chart => chart.resize());
        };

        window.addEventListener('resize', handleResize);

        return () => {
          Object.values(charts).forEach(chart => chart.dispose());
          window.removeEventListener('resize', handleResize);
        };
      }
    };

    initCharts();
  }, [chartData]);

  return (
    <div className={styles.container}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className={styles.card}>
            <div ref={cpuChartRef} className={styles.chart} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className={styles.card}>
            <div ref={memoryChartRef} className={styles.chart} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className={styles.card}>
            <div ref={ipv4ChartRef} className={styles.chart} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className={styles.card}>
            <div ref={ipv6ChartRef} className={styles.chart} />
          </Card>
        </Col>
        <Col span={24}>
          <Card className={styles.card}>
            <DiskMonitor
              data={{
                times: chartData.times,
                read: chartData.diskRead,
                write: chartData.diskWrite,
                usage: chartData.diskUsage[chartData.diskUsage.length - 1]
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServerManagement;
