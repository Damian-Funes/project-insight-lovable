
/**
 * Utilitários para processamento assíncrono e otimização de performance
 */

/**
 * Processa uma array em chunks para evitar bloqueio da UI
 */
export const processInChunks = <T, R>(
  array: T[],
  processor: (chunk: T[]) => R,
  chunkSize: number = 100,
  delay: number = 0
): R[] => {
  const results: R[] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const result = processor(chunk);
    results.push(result);
  }
  
  return results;
};

/**
 * Versão assíncrona do processamento em chunks
 */
export const processInChunksAsync = async <T, R>(
  array: T[],
  processor: (chunk: T[]) => R,
  chunkSize: number = 100,
  delay: number = 0
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const result = processor(chunk);
    results.push(result);
    
    // Pequeno delay para não bloquear a UI
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    } else {
      // Yield to event loop
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
};

/**
 * Debounce para processamento de dados
 */
export const createDataProcessor = <T, R>(
  processor: (data: T) => R,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;
  let latestData: T;
  let latestResult: R;
  
  return {
    process: (data: T): Promise<R> => {
      latestData = data;
      
      return new Promise((resolve) => {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          latestResult = processor(latestData);
          resolve(latestResult);
        }, delay);
      });
    },
    getLatest: () => latestResult
  };
};

/**
 * Memoização com expiração para resultados de cálculos pesados
 */
export class MemoizedCalculator<T, R> {
  private cache = new Map<string, { result: R; timestamp: number }>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  calculate(key: string, data: T, calculator: (data: T) => R): R {
    const now = Date.now();
    const cached = this.cache.get(key);
    
    // Verificar se o cache ainda é válido
    if (cached && (now - cached.timestamp) < this.ttl) {
      return cached.result;
    }
    
    // Calcular novo resultado
    const result = calculator(data);
    this.cache.set(key, { result, timestamp: now });
    
    // Limpar cache expirado
    this.cleanExpiredCache();
    
    return result;
  }

  private cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if ((now - value.timestamp) >= this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

/**
 * Worker simulation para cálculos pesados (usando setTimeout)
 */
export const runHeavyCalculation = <T, R>(
  data: T,
  calculator: (data: T) => R
): Promise<R> => {
  return new Promise((resolve, reject) => {
    try {
      // Simular worker usando setTimeout para não bloquear a UI
      setTimeout(() => {
        try {
          const result = calculator(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
};
