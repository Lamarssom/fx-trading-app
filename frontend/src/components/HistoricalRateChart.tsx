// src/components/HistoricalRateChart.tsx
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
} from 'chart.js';
import { useHistoricalRates } from '../hooks/useHistoricalRates';

// Register Chart.js once (can move to index.tsx if preferred)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  fromCurrency: string;
  toCurrency: string;
}

export default function HistoricalRateChart({ fromCurrency, toCurrency }: Props) {
  const { historicalRates, loading, error } = useHistoricalRates(fromCurrency, toCurrency);

  if (loading) {
    return <p className="text-center text-muted">Loading historical chart...</p>;
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (historicalRates.length === 0) {
    return <p className="text-muted text-center">No historical data available for this pair yet.</p>;
  }

  const chartData = {
    labels: historicalRates.map((d) => d.date),
    datasets: [
      {
        label: `1 ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()}`,
        data: historicalRates.map((d) => d.rate),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Exchange Rate' } },
    },
  };

  return (
    <div className="card shadow mt-5">
      <div className="card-header bg-primary text-white">
        Historical Rates ({fromCurrency.toUpperCase()} → {toCurrency.toUpperCase()}) - Last 30 Days
      </div>
      <div className="card-body" style={{ height: '320px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}