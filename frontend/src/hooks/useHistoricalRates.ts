// src/hooks/useHistoricalRates.ts
import { useState, useEffect, useCallback } from 'react';

interface HistoricalRate {
  date: string;
  rate: number;
}

export const useHistoricalRates = (fromCurrency: string, toCurrency: string) => {
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorical = useCallback(async () => {
    if (!fromCurrency || !toCurrency) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/fx/historical', {
        params: {
          from: fromCurrency.toUpperCase(),
          to: toCurrency.toUpperCase(),
          days: 30,
        },
      });

      const data = res.data;
      if (!data.historical) {
        throw new Error('No historical data returned');
      }

      setHistoricalRates(data.historical);
    } catch (err: any) {
      console.error('Historical rates fetch failed:', err);
      setError('Failed to load historical rates. Try again later.');
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchHistorical();

    // Optional: Refresh historical less frequently (e.g., every 5 minutes)
    const interval = setInterval(fetchHistorical, 300000);
    return () => clearInterval(interval);
  }, [fetchHistorical]);

  return { historicalRates, loading, error, refetch: fetchHistorical };
};