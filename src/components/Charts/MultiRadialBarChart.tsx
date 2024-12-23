import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initMultiRadialBarChartOptions } from '../../initSeries';

interface MultiRadialBarChartProps {
  height: 300 | 350 | 400;
  colors: string[];
  labels: string[];
  series: number[];
  changedSeries?: boolean;
}

interface MultiRadialBarChartState {
  series: number[];
}

// 원 모양 형상의 차트 (원 그래프가 아님)
const MultiRadialBarChart: React.FC<MultiRadialBarChartProps> = ({
  height,
  colors,
  labels,
  series,
  changedSeries,
}) => {
  const [state, setState] = useState<MultiRadialBarChartState>({ series });
  const [options, setOptions] = useState(
    initMultiRadialBarChartOptions(height, colors, labels)
  );

  useEffect(() => {
    setState({ series });
    setOptions(initMultiRadialBarChartOptions(height, colors, labels));
  }, [series, changedSeries]);

  return (
    <div id="multiRadialBarChartAccidents" className="-ml-10 -mr-10">
      <ReactApexChart
        options={options}
        series={state.series}
        type="radialBar"
      />
    </div>
  );
};

export default MultiRadialBarChart;
