import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initDonutChartOptions } from '../../initSeries';

interface DonutChartProps {
  height: 300 | 350 | 400;
  colors: string[];
  labels: string[];
  annotations?: any;
  series: number[];
}

interface DonutChartState {
  series: number[];
}

//원형 그래프 1개 + Legend props
const DonutChart: React.FC<DonutChartProps> = ({
  height,
  colors,
  labels,
  annotations,
  series,
}) => {
  const [state, setState] = useState<DonutChartState>({ series });
  const [options, setOptions] = useState(
    initDonutChartOptions(height, colors, labels, annotations)
  );

  return (
    <div className="mb-2">
      <div id="donutChart" className="-ml-5">
        <ReactApexChart options={options} series={state.series} type="donut" />
      </div>
    </div>
  );
};

export default DonutChart;
