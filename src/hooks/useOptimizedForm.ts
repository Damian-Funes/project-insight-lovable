
import { useForm, UseFormProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useMemo, useCallback } from "react";

interface OptimizedFormConfig<T extends FieldValues> extends UseFormProps<T> {
  enableOptimizations?: boolean;
}

export const useOptimizedForm = <T extends FieldValues>({
  enableOptimizations = true,
  mode = "onChange",
  reValidateMode = "onChange",
  ...config
}: OptimizedFormConfig<T>): UseFormReturn<T> => {
  // Configurações otimizadas baseadas no contexto
  const optimizedConfig = useMemo(() => {
    if (!enableOptimizations) return config;

    return {
      ...config,
      mode: mode,
      reValidateMode: reValidateMode,
      shouldFocusError: true,
      shouldUnregister: false,
      shouldUseNativeValidation: false,
      criteriaMode: "firstError" as const,
    };
  }, [config, mode, reValidateMode, enableOptimizations]);

  const form = useForm<T>(optimizedConfig);

  // Função otimizada para reset com preservação de valores padrão
  const optimizedReset = useCallback((values?: T) => {
    form.reset(values, { 
      keepDirty: false,
      keepErrors: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepValues: false,
      keepDefaultValues: true
    });
  }, [form]);

  // Função otimizada para setValue com otimizações
  const optimizedSetValue = useCallback((name: keyof T, value: any, options = {}) => {
    form.setValue(name as any, value, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
      ...options
    });
  }, [form]);

  return {
    ...form,
    reset: optimizedReset,
    setValue: optimizedSetValue,
  };
};
