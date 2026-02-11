// src/pages/Dashboard.tsx
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { COMMON_CURRENCIES } from '../constants/currencies';

interface Wallet {
  id: string;
  currency: string;
  amount: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  rate: string | null;
  status: string;
  timestamp: string;
}

interface RateResponse {
  rate: number;
}

interface ConvertResponse {
  convertedAmount: number;
}

export default function Dashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [fundCurrency, setFundCurrency] = useState('NGN');
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [fundResult, setFundResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Conversion form states
  const [fromCurrency, setFromCurrency] = useState('NGN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState<number>(0);
  const [convertResult, setConvertResult] = useState<number | null>(null);

  const fetchRate = useCallback (async () => {
    if (!fromCurrency || !toCurrency) return;

    try {
      const rateRes = await api.get<RateResponse>('/fx/rates', {
        params: { from: fromCurrency.toUpperCase(), to: toCurrency.toUpperCase() },
      });
      setCurrentRate(rateRes.data.rate);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch rate');
      setCurrentRate(null);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const walletRes = await api.get('/wallet');
        setWallets(walletRes.data || []);

        const txRes = await api.get('/transactions');
        setTransactions(txRes.data || []);

        await fetchRate();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchRate]);


  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fundAmount <= 0) return alert('Enter a valid amount');

    try {
      await api.post('/wallet/fund', {
        currency: fundCurrency.toUpperCase(),
        amount: fundAmount,
      });
      setFundResult(`Success! Funded ${fundAmount} ${fundCurrency.toUpperCase()}`);

      // Refresh data
      const walletRes = await api.get('/wallet');
      setWallets(walletRes.data || []);
      const txRes = await api.get('/transactions');
      setTransactions(txRes.data || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Funding failed');
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert('Enter a valid amount');

    try {
      const res = await api.post<ConvertResponse>('/wallet/convert', {
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
        amount,
      });
      setConvertResult(res.data.convertedAmount);

      // Refresh data
      const walletRes = await api.get('/wallet');
      setWallets(walletRes.data || []);
      const txRes = await api.get('/transactions');
      setTransactions(txRes.data || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Conversion failed');
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      {/* DATALIST - place it here, at the root level of return */}
      <datalist id="currency-list">
        {COMMON_CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.code} – {curr.name}
          </option>
        ))}
      </datalist>

      <div style={{ padding: '1rem' }}>
        <h2>Dashboard</h2>

        <section>
          <h3>Your Wallets</h3>
          {wallets.length === 0 ? (
            <p>No wallets yet. Fund one to start trading.</p>
          ) : (
            <ul>
              {wallets.map((w) => (
                <li key={w.id}>
                  <strong>{w.currency}:</strong> {w.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ margin: '2rem 0' }}>
          <h3>Exchange Rate ({fromCurrency.toUpperCase()} → {toCurrency.toUpperCase()})</h3>
          <p>
            {currentRate !== null
              ? `1 ${fromCurrency.toUpperCase()} = ${currentRate.toFixed(6)} ${toCurrency.toUpperCase()}`
              : 'Click "Fetch Rate" to see current rate'}
          </p>
          <button onClick={fetchRate}>Fetch Rate</button>
        </section>

        <section style={{ margin: '2rem 0' }}>
          <h3>Fund Wallet</h3>
          <form onSubmit={handleFund} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Updated currency input */}
            <div>
              <label>Currency:</label>
              <input
                list="currency-list"
                value={fundCurrency}
                onChange={(e) => setFundCurrency(e.target.value.toUpperCase().slice(0, 3))}
                placeholder="NGN"
                maxLength={3}
                style={{ textTransform: 'uppercase', width: '100px' }}
                required
              />
            </div>

            <div>
              <label>Amount:</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            <button type="submit">Fund</button>
          </form>

          {fundResult && (
            <p style={{ marginTop: '1rem', color: 'green' }}>{fundResult}</p>
          )}
        </section>

        <section>
          <h3>Convert Currency</h3>
          <form onSubmit={handleConvert} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Updated From input */}
            <div>
              <label>From:</label>
              <input
                list="currency-list"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value.toUpperCase().slice(0, 3))}
                placeholder="NGN"
                maxLength={3}
                style={{ textTransform: 'uppercase', width: '100px' }}
                required
              />
            </div>

            {/* Updated To input */}
            <div>
              <label>To:</label>
              <input
                list="currency-list"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value.toUpperCase().slice(0, 3))}
                placeholder="USD"
                maxLength={3}
                style={{ textTransform: 'uppercase', width: '100px' }}
                required
              />
            </div>

            <div>
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            <button type="submit">Convert</button>
          </form>

          {convertResult !== null && (
            <p style={{ marginTop: '1rem', color: 'green' }}>
              Success! Converted amount: {convertResult.toFixed(6)} {toCurrency.toUpperCase()}
            </p>
          )}
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>From → To</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>
                      {tx.fromCurrency} → {tx.toCurrency}
                    </td>
                    <td>{tx.rate ?? '-'}</td>
                    <td>{tx.status}</td>
                    <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}