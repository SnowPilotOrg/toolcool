import { useState, useCallback } from "react";

export function useInput(initialValue = "") {
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
