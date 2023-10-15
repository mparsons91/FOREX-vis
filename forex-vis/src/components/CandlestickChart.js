import React, {useState, useEffect} from 'react';
import forexData from '../data/dummy_data.csv'
import Papa from 'papaparse';
import ApexChart from 'react-apexcharts';

const CandlestickChart = (props) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'candlestick',
        height: 350,
      },
      xaxis: {
        type: 'datetime',
      },
    },
    series: [
      {
        data: [],
      },
    ],
  });

  useEffect(() => {
    const parseCSVData = (data) => {
      return data.map((row) => {
        const [timestamp, open, close, high, low] = row;
        return {
          x: new Date(timestamp).getTime(),
          y: [parseFloat(open), parseFloat(high), parseFloat(low), parseFloat(close)],
        };
      });
    };

    const fetchParseData = async () => {
      Papa.parse(forexData, {
        download: true,
        delimiter: ",",
        complete: (result) => {
          const data = parseCSVData(result.data);
          setChartData({
            ...chartData,
            series: [
              {
                data: data,
              },
            ],
          });
        },
      });
    };
    fetchParseData();
  }, [chartData]);
  

  return (
    <div className="candlestick-chart">
      <ApexChart options={chartData.options} series={chartData.series} type="candlestick" height={350} />
    </div>
  );
};

export default CandlestickChart;

