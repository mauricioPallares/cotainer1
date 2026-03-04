import { useState } from 'react';

const LOCALE = 'es-CO';
const CURRENCY = 'COP';

function toNumericString(value: string): string {
    return value.replaceAll(/\D/g, '');
}

function formatDisplay(raw: string): string {
    if (!raw) return '';
    const numeric = Number(raw);
    if (Number.isNaN(numeric)) return raw;
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numeric);
}

interface UseCurrencyInputReturn {
    displayValue: string;
    rawValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setValue: (value: string) => void;
}

export function useCurrencyInput(initial = ''): UseCurrencyInputReturn {
    const [rawValue, setRawValue] = useState<string>(toNumericString(initial));
    const [displayValue, setDisplayValue] = useState<string>(formatDisplay(toNumericString(initial)));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const digits = toNumericString(e.target.value);
        setRawValue(digits);
        setDisplayValue(formatDisplay(digits));
    };

    const setValue = (value: string): void => {
        const digits = toNumericString(value);
        setRawValue(digits);
        setDisplayValue(formatDisplay(digits));
    };

    return { displayValue, rawValue, onChange, setValue };
}
