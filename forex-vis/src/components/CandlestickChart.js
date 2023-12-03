import React, { useState, useEffect } from 'react';
import forexData from '../data/dummy_data.csv';
import Papa from 'papaparse';
import ApexChart from 'react-apexcharts';
import './CandlestickChart.css';

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
      grid: {
        borderColor: '#333',
        strokeDashArray: 4,
      },
    },
    series: [
      {
        data: [],
      },
    ],
  });

  const [visibleRange, setVisibleRange] = useState({
    minIndex: 0,
    maxIndex: 0,
  });

  const [lastVisibleTimestamp, setLastVisibleTimestamp] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const parseCSVData = (data) => {
      return data.map((row) => {
        const [timestamp, low, high, open, close] = row;
        return {
          x: new Date(timestamp).getTime(),
          y: [parseFloat(low), parseFloat(high), parseFloat(open), parseFloat(close)],
        };
      });
    };

    const fetchParseData = async () => {
      Papa.parse(forexData, {
        download: true,
        delimiter: ',',
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

          setLastVisibleTimestamp(new Date(data[0].x).toLocaleString());
        },
      });
    };
    fetchParseData();
  }, [chartData]);

  useEffect(() => {
    const lastVisibleEntry = chartData.series[0].data[visibleRange.maxIndex - 1];
    if (lastVisibleEntry) {
      const currentTimestamp = new Date(lastVisibleEntry.x);
      currentTimestamp.setDate(currentTimestamp.getDate() + 1);
      setLastVisibleTimestamp(currentTimestamp.toLocaleString());
    }
  }, [visibleRange, chartData]);

  useEffect(() => {
    let intervalId;

    const play = () => {
      intervalId = setInterval(() => {
        setVisibleRange((prevRange) => ({
          minIndex: prevRange.minIndex,
          maxIndex: prevRange.maxIndex + 1,
        }));
      }, playbackSpeed);

      setIsPlaying(true);
    };

    const stop = () => {
      clearInterval(intervalId);
      setIsPlaying(false);
    };

    if (isPlaying) {
      play();
    } else {
      stop();
    }

    return () => stop();
  }, [isPlaying, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const visibleData = chartData.series[0].data.slice(visibleRange.minIndex, visibleRange.maxIndex);

  const goToStart = () => {
    setVisibleRange({ minIndex: 0, maxIndex: 0 });
  };

  const goToEnd = () => {
    const maxIndex = chartData.series[0].data.length;
    setVisibleRange({ minIndex: 0, maxIndex });
  };

  const allowedSpeeds = [0.2 * 500, 0.5 * 500, 0.57 * 500, 0.667 * 500, 0.8 * 500, 1.0 * 500, 1.333 * 500, 2.0 * 500, 4.0 * 500];

  const increaseSpeed = () => {
    const index = allowedSpeeds.indexOf(playbackSpeed);
    const newIndex = Math.min(index + 1, allowedSpeeds.length - 1);
    setPlaybackSpeed(allowedSpeeds[newIndex]);
  };

  const decreaseSpeed = () => {
    const index = allowedSpeeds.indexOf(playbackSpeed);
    const newIndex = Math.max(index - 1, 0);
    setPlaybackSpeed(allowedSpeeds[newIndex]);
  };

  return (
    <div className="candlestick-chart">
        <ApexChart options={chartData.options} series={[{ data: visibleData }]} type="candlestick" height={350} />
        <label>Date: {lastVisibleTimestamp}</label>
        <div id="playback-slider">
            <input
                id="slider"
                type="range"
                min="0"
                max={chartData.series[0].data.length}
                value={visibleRange.maxIndex}
                onChange={(e) =>
                    setVisibleRange({
                        minIndex: 0,
                        maxIndex: parseInt(e.target.value, 10),
                    })
                }
            />
        </div>
        <div className="navigation-buttons">
            <div className="playback-buttons">
                <button className="navigation-button" onClick={goToStart}>
                    I◀
                </button>
                <button className="navigation-button" onClick={togglePlay}>
                    {isPlaying ? '◼' : '▶'}
                </button>
                <button className="navigation-button" onClick={goToEnd}>
                    ▶I
                </button>
            </div>
            <div className="speed-buttons">
                <button className="speed-button" onClick={increaseSpeed}>
                    -
                </button>
                <div className="speed-indicator">
                    <label>{(1 / (playbackSpeed / 500)).toFixed(2)}x Playback Speed</label>
                </div>
                <button className="speed-button" onClick={decreaseSpeed}>
                    +
                </button>
            </div>
        </div>
    </div>
  );
};

export default CandlestickChart;
