/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/MockPaystackModal.tsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface MockPaystackModalProps {
  show: boolean;
  onHide: () => void;
  amount: number;
  currency: string;
  onSuccess: () => void;
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
        setStatus('idle');
        setMessage('');

        setTimeout(() => {
            const trimmedCard = cardNumber.replace(/\s/g, '');
            const trimmedExpiry = expiry.replace(/\s/g, '');
            const trimmedCvv = cvv;

            if (trimmedCard.length !== 16) {
            setStatus('error');
            setMessage('Invalid card number (must be 16 digits)');
            } else if (!/^\d{2}\/\d{2}$/.test(trimmedExpiry)) {
            setStatus('error');
            setMessage('Invalid expiry format (use MM/YY)');
            } else if (trimmedCvv !== '123') {
            setStatus('error');
            setMessage('Invalid CVV. Hint: use 123 for success in demo mode');
            } else {
            setStatus('success');
            setMessage('Payment successful! Funds added.');
            setTimeout(() => {
                onSuccess();
                onHide();
            }, 1800);
            }

            setLoading(false);
        }, 2200);
    };

  return (
    <Modal 
        show={show} 
        onHide={onHide} 
        centered 
        size="lg"
        dialogClassName="paystack-modal"
    >
        <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="d-flex align-items-center">
            <img 
                src="https://paystack.com/assets/paystack-mark.5f5f5f.svg" 
                alt="Paystack" 
                style={{ height: '32px', marginRight: '12px' }}
            />
            Pay with Paystack
            </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
            <div className="text-center mb-4">
            <h5 className="mb-1">Pay {amount.toLocaleString()} {currency.toUpperCase()}</h5>
            <small className="text-muted">to FX Trading App</small>
            </div>

            {status === 'success' && (
            <Alert variant="success" className="text-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
            </Alert>
            )}
            {status === 'error' && (
            <Alert variant="danger" className="text-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {message}
            </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                            setCardNumber(val);
                        }}
                        disabled={loading || status === 'success'}
                        maxLength={19} // allow spaces if you want to format later
                        required
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
                                onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                                    setExpiry(val);
                                }}
                                disabled={loading || status === 'success'}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="password"  // hide digits
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                disabled={loading || status === 'success'}
                                maxLength={3}
                                required
                            />
                        </Form.Group>
                    </div>
                </div>

                <Form.Text className="text-muted d-block text-center mb-3 small">
                    Demo mode: Use any 16-digit number, valid MM/YY, CVV 123 for success.
                </Form.Text>

                <Button 
                    variant="success"
                    type="submit"
                    className="w-100 mt-2 py-3 fw-bold"
                    style={{ backgroundColor: '#00C4B4', borderColor: '#00C4B4' }}
                    disabled={loading || status === 'success'}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                        </>
                    ) : (
                      `Pay ${amount.toLocaleString()} ${currency.toUpperCase()}`
                    )}
                </Button>
            </Form>

            <div className="text-center mt-4">
                <small className="text-muted">
                Secured by <strong>Paystack</strong> • No card details are stored
                </small>
            </div>
            </Modal.Body>
        </Modal>
    );
}