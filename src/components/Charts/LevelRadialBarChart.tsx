import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initLevelRadialBarChartOptions } from '../../initSeries';

interface LevelRadialBarChartProps {
  height: 300 | 350 | 400;
  colors: string[];
  labels: string[];
  series: number[];
  level: string;
  changedSeries?: boolean;
}

interface LevelRadialBarChartState {
  series: number[];
}

// 원 모양 형상의 차트 (원 그래프가 아님)
const LevelRadialBarChart: React.FC<LevelRadialBarChartProps> = ({
  height,
  colors,
  labels,
  series,
  level,
  changedSeries,
}) => {
  const [state, setState] = useState<LevelRadialBarChartState>({ series });
  const [options, setOptions] = useState(
    initLevelRadialBarChartOptions(height, colors, labels, level)
  );

  useEffect(() => {
    setState({ series });
    setOptions(initLevelRadialBarChartOptions(height, colors, labels, level));
  }, [series, changedSeries]);

  return (
    <div
      id="LevelRadialBarChartSaftyLevel"
      style={{ pointerEvents: 'none' }}
      className="-ml-15 -mr-15"
    >
      <ReactApexChart
        options={options}
        series={state.series}
        type="radialBar"
      />
    </div>
  );
};

export default LevelRadialBarChart;
