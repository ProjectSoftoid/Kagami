import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './style.module.scss';
import { Card, Progress } from 'antd';

interface DiskMonitorProps {
  data: {
    times: string[];
    read: number[];
    write: number[];
    usage?: number;
  };
}

const DiskMonitor: React.FC<DiskMonitorProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const getProgressStatus = (usage: number): "exception" | "success" | "normal" | undefined => {
    if (usage >= 90) return 'exception';
    if (usage >= 70) return 'normal';
    return 'success';
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: '磁盘吞吐量',
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['读取', '写入'],
        textStyle: {
          color: '#fff'
        },
        top: 25
      },
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
        data: data.times,
        axisLabel: {
          color: '#fff'
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'MB/s',
        nameTextStyle: {
          color: '#fff'
        },
        axisLabel: {
          color: '#fff',
          formatter: (value: number) => {
            if (value >= 1000) {
              return (value / 1000).toFixed(2) + ' GB/s';
            }
            return value.toFixed(2) + ' MB/s';
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: [
        {
          name: '读取',
          type: 'line',
          data: data.read,
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(103, 194, 58, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(103, 194, 58, 0)'
              }
            ])
          }
        },
        {
          name: '写入',
          type: 'line',
          data: data.write,
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#E6A23C'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(230, 162, 60, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(230, 162, 60, 0)'
              }
            ])
          }
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <Card bordered={false} className={styles.card}>
      {data.usage !== undefined && (
        <div className={styles.usageSection}>
          <div className={styles.usageTitle}>磁盘使用率</div>
          <Progress
            percent={data.usage}
            status={getProgressStatus(data.usage)}
            strokeColor={{
              '0%': '#108ee9',
              '100%': data.usage >= 90 ? '#f5222d' : data.usage >= 70 ? '#faad14' : '#52c41a'
            }}
            trailColor="rgba(255, 255, 255, 0.1)"
          />
        </div>
      )}
      <div ref={chartRef} className={styles.chart} />
    </Card>
  );
};

export default DiskMonitor;
