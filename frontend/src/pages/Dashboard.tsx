// src/pages/Dashboard.tsx
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import CurrencySelect from '../components/CurrencySelect';

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
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fromCurrency, setFromCurrency] = useState('NGN');
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-4">  {/* Main container */}
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">  {/* Grid layout for sections */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">  {/* Card for wallets */}
            <div className="card-header bg-primary text-white">Your Wallets</div>
            <div className="card-body">
              {wallets.length === 0 ? (
                <p>No wallets yet. Fund one to start trading.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {wallets.map((w) => (
                    <li key={w.id} className="list-group-item">
                      <strong>{w.currency}:</strong> {w.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">Exchange Rate ({fromCurrency.toUpperCase()} → {toCurrency.toUpperCase()})</div>
            <div className="card-body">
              <p>
                {currentRate !== null
                  ? `1 ${fromCurrency.toUpperCase()} = ${currentRate.toFixed(6)} ${toCurrency.toUpperCase()}`
                  : 'Click "Fetch Rate" to see current rate'}
              </p>
              <button className="btn btn-primary" onClick={fetchRate}>Fetch Rate</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">Fund Wallet</div>
            <div className="card-body">
              <form onSubmit={handleFund} className="d-flex flex-column gap-3">  {/* Flex for spacing */}
                <div className="form-group">
                  <CurrencySelect
                    label="Currency"
                    value={fundCurrency}
                    onChange={(e) => setFundCurrency(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Fund</button>
              </form>
              {fundResult && (
                <p className="mt-3 text-success">{fundResult}</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">Convert Currency</div>
            <div className="card-body">
              <form onSubmit={handleConvert} className="d-flex flex-column gap-3">
                <div className="form-group">
                  <CurrencySelect
                    label="From"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <CurrencySelect
                    label="To"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Convert</button>
              </form>
              {convertResult !== null && (
                <p className="mt-3 text-success">
                  Success! Converted amount: {convertResult.toFixed(6)} {toCurrency.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow mt-4">
        <div className="card-header bg-primary text-white">Transaction History</div>
        <div className="card-body">
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <div className="table-responsive">  {/* Responsive table */}
              <table className="table table-striped table-hover">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}