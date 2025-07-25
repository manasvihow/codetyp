import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ResultsGraph = ({ wpmHistory, errorHistory }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2c2c2e',
        titleColor: '#e5e5e5',
        bodyColor: '#e5e5e5',
        borderColor: '#555',
        borderWidth: 1,
      }
    },
    scales: {
        x: {
            ticks: { color: '#a0a0a0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Words per Minute', color: '#e5c07b' },
            ticks: { color: '#e5c07b' },
            grid: { drawOnChartArea: false },
            suggestedMin: 0,
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Errors', color: '#e06c75' },
            ticks: { color: '#e06c75', stepSize: 1 },
            grid: { drawOnChartArea: false },
            suggestedMin: 0,
        }
    }
  };

  const data = {
    labels: wpmHistory.map((_, index) => (index + 1) * 2),
    datasets: [
      {
        label: 'WPM',
        data: wpmHistory,
        borderColor: '#e5c07b',
        backgroundColor: 'rgba(229, 192, 123, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 2,
        pointHoverRadius: 4
      },
      {
        label: 'Errors',
        data: errorHistory,
        borderColor: '#e06c75',
        backgroundColor: 'rgba(224, 108, 117, 0.2)',
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 2,
        pointHoverRadius: 4,
        stepped: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default ResultsGraph;
