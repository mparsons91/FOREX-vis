// src/components/CandlestickChart.js

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ApexChart from 'react-apexcharts';

const CandlestickChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState({
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('forex-vis/src/data/dummy_data.csv');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const result = await reader.read();
        const text = new TextDecoder().decode(result.value);
        const parsedData = Papa.parse(text);

        console.log('Parsed data:', parsedData);

        // Transform the data for the candlestick chart
        const startDateTime = new Date('2020-01-01 17:00');
        const candlestickData = parsedData.data.map((row, index) => {
          const xDate = new Date(startDateTime);
          xDate.setMinutes(xDate.getMinutes() + index);
          return {
            x: xDate.getTime(), // Use the timestamp as the x value
            y: [Number(row[2]), Number(row[1]), Number(row[3]), Number(row[4])],
          };
        });

        console.log('Candlestick data:', candlestickData);

        setData(candlestickData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log('Data:', data);

  return (
    <div>
      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <ApexChart
          options={options}
          series={[
            {
              data: data,
            },
          ]}
          type="candlestick"
          width="100%"
          height={400}
        />
      )}
    </div>
  );
};

export default CandlestickChart;
