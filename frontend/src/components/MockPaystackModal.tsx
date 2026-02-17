// src/components/MockPaystackModal.tsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface MockPaystackModalProps {
  show: boolean;
  onHide: () => void;
  amount: number;
  currency: string;
  onSuccess: () => void; // Callback to trigger real fund API call
}

export default function MockPaystackModal({
  show,
  onHide,
  amount,
  currency,
  onSuccess,
}: MockPaystackModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Fake validation & delay
    setTimeout(() => {
      if (cardNumber.length === 16 && expiry.length === 5 && cvv.length === 3) {
        setStatus('success');
        setMessage('Payment successful! Funds added.');
        setTimeout(() => {
          onSuccess();   // Trigger real /wallet/fund
          onHide();
        }, 1500);
      } else {
        setStatus('error');
        setMessage('Invalid card details. Try again.');
      }
      setLoading(false);
    }, 2000); // Simulate network delay
  };

  return (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Pay with Paystack</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="text-center mb-4">
            Paying <strong>{amount.toFixed(2)} {currency.toUpperCase()}</strong>
            </p>

            {status === 'success' ? (
            <Alert variant="success" className="text-center">
                {message} Redirecting...
            </Alert>
            ) : status === 'error' ? (
            <Alert variant="danger">{message}</Alert>
            ) : null}

            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e: { target: { value: string; }; }) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                disabled={loading || status === 'success'}
                maxLength={16}
                />
            </Form.Group>

            <div className="row">
                <div className="col-6">
                <Form.Group className="mb-3">
                    <Form.Label>Expiry (MM/YY)</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="12/28"
                    value={expiry}
                    onChange={(e: { target: { value: string; }; }) => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                        setExpiry(val);
                    }}
                    disabled={loading || status === 'success'}
                    />
                </Form.Group>
                </div>
                <div className="col-6">
                <Form.Group className="mb-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e: { target: { value: string; }; }) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    disabled={loading || status === 'success'}
                    maxLength={3}
                    />
                </Form.Group>
                </div>
            </div>

            <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading || status === 'success'}
            >
                {loading ? 'Processing...' : `Pay ${amount.toFixed(2)} ${currency.toUpperCase()}`}
            </Button>
            </Form>

            <p className="text-muted text-center mt-3 small">
            This is a mock payment for demo purposes. No real charge.
            </p>
        </Modal.Body>
      </Modal>
    );
}