
import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce";

interface AsyncValidationConfig {
  debounceMs?: number;
  validateOnMount?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  isValidating: boolean;
}

export const useAsyncValidation = (
  validationFn: (value: any) => Promise<boolean | string>,
  config: AsyncValidationConfig = {}
) => {
  const { debounceMs = 500, validateOnMount = false } = config;
  
  const [validationState, setValidationState] = useState<ValidationResult>({
    isValid: true,
    isValidating: false,
  });

  const validateValue = useCallback(async (value: any) => {
    if (!value && !validateOnMount) {
      setValidationState({ isValid: true, isValidating: false });
      return true;
    }

    setValidationState(prev => ({ ...prev, isValidating: true }));

    try {
      const result = await validationFn(value);
      const isValid = result === true;
      const error = typeof result === "string" ? result : undefined;

      setValidationState({
        isValid,
        error,
        isValidating: false,
      });

      return isValid;
    } catch (error) {
      setValidationState({
        isValid: false,
        error: "Erro de validação",
        isValidating: false,
      });
      return false;
    }
  }, [validationFn, validateOnMount]);

  const debouncedValidate = useDebounce(validateValue, debounceMs);

  const validate = useCallback((value: any) => {
    return debouncedValidate(value);
  }, [debouncedValidate]);

  return {
    ...validationState,
    validate,
  };
};
