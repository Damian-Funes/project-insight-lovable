
import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MemoizedCalculator, processInChunks, runHeavyCalculation } from "@/utils/asyncProcessing";

/**
 * Hook para processamento otimizado de dados com memoização e chunks assíncronos
 */
export const useOptimizedDataProcessing = <T, R>(
  data: T[],
  processor: (chunk: T[]) => R,
  options: {
    chunkSize?: number;
    debounceDelay?: number;
    memoizationTTL?: number;
    enabled?: boolean;
  } = {}
) => {
  const {
    chunkSize = 100,
    debounceDelay = 300,
    memoizationTTL = 5,
    enabled = true
  } = options;

  // Debounce dos dados
  const debouncedData = useDebounce(data, debounceDelay);
  
  // Calculator memoizado
  const calculatorRef = useRef(new MemoizedCalculator<T[], R[]>(memoizationTTL));
  
  // Estado de processamento
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<R[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Função de processamento otimizada
  const processData = useCallback(async () => {
    if (!enabled || !debouncedData || debouncedData.length === 0) {
      setResults([]);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cacheKey = JSON.stringify(debouncedData);
      
      const processedResults = calculatorRef.current.calculate(
        cacheKey,
        debouncedData,
        (data) => {
          return processInChunks(
            data,
            processor,
            chunkSize,
            0
          );
        }
      );

      setResults(processedResults);
    } catch (err) {
      setError(err as Error);
      console.error("Erro no processamento otimizado:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [debouncedData, processor, chunkSize, enabled]);

  // Executar processamento quando dados mudarem
  useEffect(() => {
    processData();
  }, [processData]);

  // Limpar cache quando componente desmonta
  useEffect(() => {
    return () => {
      calculatorRef.current.clear();
    };
  }, []);

  // Métricas memoizadas
  const metrics = useMemo(() => {
    if (!results || results.length === 0) {
      return {
        totalProcessed: 0,
        processingRate: 0,
        cacheHitRate: 0
      };
    }

    return {
      totalProcessed: results.length,
      processingRate: debouncedData ? results.length / debouncedData.length : 0,
      cacheHitRate: 0 // seria calculado com mais contexto
    };
  }, [results, debouncedData]);

  return {
    results,
    isProcessing,
    error,
    metrics,
    reprocess: processData
  };
};

/**
 * Hook para cálculos pesados com worker simulation
 */
export const useHeavyCalculation = <T, R>(
  data: T,
  calculator: (data: T) => R,
  dependencies: any[] = [],
  enabled: boolean = true
) => {
  const [result, setResult] = useState<R | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedData = useDebounce(data, 300);

  const performCalculation = useCallback(async () => {
    if (!enabled || !debouncedData) return;

    setIsCalculating(true);
    setError(null);

    try {
      const calculationResult = await runHeavyCalculation(debouncedData, calculator);
      setResult(calculationResult);
    } catch (err) {
      setError(err as Error);
      console.error("Erro no cálculo pesado:", err);
    } finally {
      setIsCalculating(false);
    }
  }, [debouncedData, calculator, enabled, ...dependencies]);

  useEffect(() => {
    performCalculation();
  }, [performCalculation]);

  return {
    result,
    isCalculating,
    error,
    recalculate: performCalculation
  };
};
