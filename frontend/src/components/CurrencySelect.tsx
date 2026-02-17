// src/components/CurrencySelect.tsx
import Select from 'react-select';
import { COMMON_CURRENCIES } from '../constants/currencies';

interface CurrencyOption {
  value: string;
  label: string;
}

interface CurrencySelectProps {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
}

export default function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  const options: CurrencyOption[] = COMMON_CURRENCIES.map((curr) => ({
    value: curr.code,
    label: `${curr.code} - ${curr.name}`,
  }));

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected ? selected.value : '')}
        placeholder={`Select ${label.toLowerCase()}`}
        isSearchable={true}
        className="currency-select"
        classNamePrefix="currency-select"
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '38px',        
            fontSize: '0.95rem',
            borderColor: '#ced4da',
            boxShadow: 'none',
            '&:hover': { borderColor: '#86b7fe' },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,             
            fontSize: '0.9rem',
            maxHeight: '300px',    
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: '280px',
            overflowY: 'auto',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : 'white',
            color: state.isSelected ? 'white' : 'black',
          }),
        }}
      />
    </div>
  );
}