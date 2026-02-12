// src/components/CurrencySelect.tsx
import { COMMON_CURRENCIES } from '../constants/currencies';

interface CurrencySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

export default function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  return (
    <div>
      <label>{label}:</label>
      <select
        value={value}
        onChange={onChange}
        style={{ width: '150px' }}
        required
      >
        {COMMON_CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.code} - {curr.name}
          </option>
        ))}
      </select>
    </div>
  );
}