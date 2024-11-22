import { useState, useCallback } from 'react';

export function useInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    setValue,
    reset,
  };
} 