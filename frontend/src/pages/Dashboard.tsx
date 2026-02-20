// src/pages/Dashboard.tsx
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import CurrencySelect from '../components/CurrencySelect';
import HistoricalRateChart from '../components/HistoricalRateChart';
import MockPaystackModal from '../components/MockPaystackModal';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [fundResult, setFundResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevRate, setPrevRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
      const newRate = rateRes.data.rate;
      
      setPrevRate(currentRate)
      setCurrentRate(newRate);
      setLastUpdated(new Date());

    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch rate');
      setCurrentRate(null);
    }
  }, [fromCurrency, toCurrency, currentRate]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const walletRes = await api.get('/wallet');
        setWallets(walletRes.data || []);
        const txRes = await api.get('/transactions');
        setTransactions(txRes.data || []);

      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    fetchRate();

    const intervalID = setInterval(() => {
      fetchRate();
    }, 100000);

    return () => clearInterval(intervalID);
  }, [fetchRate, fromCurrency, toCurrency]);


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
    <div className="min-vh-100 bg-dark py-5">
      <div className="container px-3 px-md-4">

        {/* Dashboard Header - Nova style */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold text-white mb-1">Dashboard</h1>
            <p className="text-white-50 mb-0">Welcome back • Real-time FX Trading</p>
          </div>
          <div className="text-end">
            <small className="text-white-50 d-block">Last updated just now</small>
          </div>
        </div>

        {/* Nova-style Tabs */}
        <ul className="nav nav-pills nav-fill gap-2 mb-4" id="dashboardTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active rounded-pill fw-medium py-3"
              id="overview-tab"
              data-bs-toggle="tab"
              data-bs-target="#overview"
              type="button"
              role="tab"
              aria-controls="overview"
              aria-selected="true"
            >
              <i className="bi bi-speedometer2 me-2"></i> Overview
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link rounded-pill fw-medium py-3"
              id="actions-tab"
              data-bs-toggle="tab"
              data-bs-target="#actions"
              type="button"
              role="tab"
              aria-controls="actions"
              aria-selected="false"
            >
              <i className="bi bi-currency-exchange me-2"></i> Actions
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link rounded-pill fw-medium py-3"
              id="history-tab"
              data-bs-toggle="tab"
              data-bs-target="#history"
              type="button"
              role="tab"
              aria-controls="history"
              aria-selected="false"
            >
              <i className="bi bi-clock-history me-2"></i> History
            </button>
          </li>
        </ul>

        <div className="tab-content" id="dashboardTabContent">

          {/* ==================== OVERVIEW TAB ==================== */}
          <div className="tab-pane fade show active" id="overview" role="tabpanel">
            <div className="row g-4">

              {/* Wallets Card */}
              <div className="col-lg-5">
                <div className="card border-0 shadow-lg bg-dark h-100 rounded-4 overflow-hidden">
                  <div className="card-header bg-gradient text-white py-4 border-0">
                    <h5 className="mb-0 fw-semibold">Your Wallets</h5>
                  </div>
                  <div className="card-body p-4">
                    {wallets.length === 0 ? (
                      <div className="text-center py-5 text-white-50">
                        <i className="bi bi-wallet2 fs-1 mb-3 d-block"></i>
                        No wallets yet. Fund one below.
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {wallets.map((w) => (
                          <div key={w.id} className="list-group-item bg-transparent border-0 d-flex justify-content-between py-3">
                            <div className="fw-medium">{w.currency}</div>
                            <div className="fs-4 fw-bold text-white">{w.amount.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Rate + Chart */}
              <div className="col-lg-7">
                <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden mb-4">
                  <div className="card-header bg-gradient text-white py-4 border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-semibold">Live Exchange Rate</h5>
                    {lastUpdated && (
                      <small className="text-white-50">Updated {lastUpdated.toLocaleTimeString()}</small>
                    )}
                  </div>
                  <div className="card-body p-5 text-center">
                    {currentRate !== null ? (
                      <div className="display-5 fw-bold text-white mb-2">
                        1 {fromCurrency.toUpperCase()} = {currentRate.toFixed(6)} {toCurrency.toUpperCase()}
                        {prevRate !== null && (
                          <span className={`ms-3 fs-3 ${currentRate > prevRate ? 'text-success' : currentRate < prevRate ? 'text-danger' : 'text-white-50'}`}>
                            {currentRate > prevRate ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-white-50">Fetching latest rate...</p>
                    )}
                  </div>
                </div>

                {/* Chart */}
                <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden">
                  <div className="card-body p-4">
                    <HistoricalRateChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== ACTIONS TAB ==================== */}
          <div className="tab-pane fade" id="actions" role="tabpanel">
            <div className="row g-4">
              {/* Fund Wallet */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden h-100">
                  <div className="card-header bg-gradient text-white py-4 border-0">
                    <h5 className="mb-0 fw-semibold">Fund Wallet</h5>
                  </div>
                  <div className="card-body p-5">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (fundAmount <= 0) return alert('Enter a valid amount');
                      setShowPaymentModal(true);
                    }}>
                      <div className="mb-4">
                        <CurrencySelect
                          label="Currency"
                          value={fundCurrency}
                          onChange={setFundCurrency}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-medium">Amount</label>
                        <input
                          type="number"
                          className="form-control form-control-lg bg-transparent text-white border-secondary"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(Number(e.target.value))}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-medium py-3">
                        Proceed to Pay with Paystack
                      </button>
                    </form>
                    {fundResult && <div className="alert alert-success mt-4 text-center">{fundResult}</div>}
                  </div>
                </div>
              </div>

              {/* Convert Currency */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden h-100">
                  <div className="card-header bg-gradient text-white py-4 border-0">
                    <h5 className="mb-0 fw-semibold">Convert Currency</h5>
                  </div>
                  <div className="card-body p-5">
                    <form onSubmit={handleConvert} className="d-flex flex-column gap-4">
                      <div>
                        <CurrencySelect label="From" value={fromCurrency} onChange={setFromCurrency} />
                      </div>
                      <div>
                        <CurrencySelect label="To" value={toCurrency} onChange={setToCurrency} />
                      </div>
                      <div>
                        <label className="form-label fw-medium">Amount</label>
                        <input
                          type="number"
                          className="form-control form-control-lg bg-transparent text-white border-secondary"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-medium py-3">
                        Convert Now
                      </button>
                    </form>
                    {convertResult !== null && (
                      <div className="alert alert-success mt-4 text-center">
                        Success! You received {convertResult.toFixed(6)} {toCurrency.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane fade" id="history" role="tabpanel">
            <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden">
              <div className="card-header bg-gradient text-white py-4 border-0">
                <h5 className="mb-0 fw-semibold">Transaction History</h5>
              </div>
              <div className="card-body p-0">
                {transactions.length === 0 ? (
                  <div className="text-center py-5 text-white-50">
                    <i className="bi bi-journal-text fs-1 mb-3 d-block"></i>
                    No transactions yet
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th className="ps-4">Type</th>
                          <th>Amount</th>
                          <th>From → To</th>
                          <th>Rate</th>
                          <th>Status</th>
                          <th className="text-end pe-4">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="ps-4 fw-medium">{tx.type}</td>
                            <td className={Number(tx.amount) > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                              {tx.amount}
                            </td>
                            <td>{tx.fromCurrency} → {tx.toCurrency}</td>
                            <td>{tx.rate ?? '—'}</td>
                            <td>
                              <span className={`badge ${tx.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="text-end pe-4 text-white-50">
                              {new Date(tx.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Paystack Modal */}
      <MockPaystackModal
      show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        amount={fundAmount}
        currency={fundCurrency}
        onSuccess={async () => {
          try {
            await api.post('/wallet/fund', {
              currency: fundCurrency.toUpperCase(),
              amount: fundAmount,
            });
            setFundResult(`Success! Funded ${fundAmount} ${fundCurrency.toUpperCase()}`);

            const walletRes = await api.get('/wallet');
            setWallets(walletRes.data || []);
            const txRes = await api.get('/transactions');
            setTransactions(txRes.data || []);
          } catch (err: any) {
            alert(err.response?.data?.message || 'Funding failed');
          }
        }}
      />
    </div>
  );
}