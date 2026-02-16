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
      // Calculate dates: last 30 days
      const today = new Date().toISOString().split('T')[0];
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const startDate = start.toISOString().split('T')[0];

      // Frankfurter API (free, no key needed, supports many pairs; base is fromCurrency)
      const url = `https://api.frankfurter.app/${startDate}..${today}?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (!data.rates) throw new Error('No rates data returned');

      // Transform to array of {date, rate}
      const ratesArray: HistoricalRate[] = Object.entries(data.rates).map(([date, ratesObj]: [string, any]) => ({
        date,
        rate: ratesObj[toCurrency.toUpperCase()] as number || 0,
      }));

      // Sort by date ascending (Frankfurter usually returns newest first)
      ratesArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setHistoricalRates(ratesArray);
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