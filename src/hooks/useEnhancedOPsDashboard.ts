
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export interface EnhancedOPFilters {
  projeto_id?: string;
  area_id?: string;
  status?: string;
  data_inicio_de?: string;
  data_inicio_ate?: string;
  limit?: number;
  offset?: number;
}

export interface EnhancedOPWithDetails {
  id: string;
  numero_op: string;
  descricao_op: string;
  status_op: string;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  projeto_id: string;
  area_responsavel_id: string;
  nome_projeto: string;
  nome_area: string;
  custo_hora_padrao?: number;
  tempo_execucao_dias?: number;
  custo_total?: number;
}

export const useEnhancedOPsDashboard = (filters: EnhancedOPFilters = {}) => {
  // Debounce dos filtros
  const debouncedFilters = useDebounce(filters, 300);

  const query = useQuery({
    queryKey: ["enhanced-ops-dashboard", debouncedFilters],
    queryFn: async (): Promise<EnhancedOPWithDetails[]> => {
      console.log("Buscando OPs otimizadas com filtros:", debouncedFilters);

      try {
        const { data, error } = await supabase.rpc('buscar_ops_dashboard', {
          filtro_projeto_id: debouncedFilters.projeto_id && debouncedFilters.projeto_id !== "all" 
            ? debouncedFilters.projeto_id 
            : null,
          filtro_area_id: debouncedFilters.area_id && debouncedFilters.area_id !== "all" 
            ? debouncedFilters.area_id 
            : null,
          filtro_status: debouncedFilters.status && debouncedFilters.status !== "all" 
            ? debouncedFilters.status 
            : null,
          filtro_data_inicio_de: debouncedFilters.data_inicio_de || null,
          filtro_data_inicio_ate: debouncedFilters.data_inicio_ate || null,
          limite: debouncedFilters.limit || 30,
          offset_valor: debouncedFilters.offset || 0
        });

        if (error) {
          console.error("Erro ao buscar OPs:", error);
          throw new Error(`Falha ao carregar ordens de produção: ${error.message}`);
        }

        console.log(`OPs otimizadas carregadas: ${data?.length || 0}`);
        return data || [];
      } catch (error) {
        console.error("Erro na query OPs dashboard otimizada:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (previousData) => previousData,
  });

  // Processamento assíncrono em chunks para estatísticas complexas
  const processOPStatistics = useCallback(async (ops: EnhancedOPWithDetails[]) => {
    if (!ops || ops.length === 0) return null;

    // Processar em chunks de 50 itens para não bloquear a UI
    const chunkSize = 50;
    const chunks = [];
    
    for (let i = 0; i < ops.length; i += chunkSize) {
      chunks.push(ops.slice(i, i + chunkSize));
    }

    let totalStats = {
      totalOPs: 0,
      completedOPs: 0,
      delayedOPs: 0,
      totalCost: 0,
      averageExecutionDays: 0,
      statusDistribution: {} as Record<string, number>
    };

    // Processar cada chunk com um pequeno delay para não bloquear a UI
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chunkStats = chunk.reduce((acc, op) => {
        acc.totalOPs++;
        
        if (op.status_op === 'Concluída') {
          acc.completedOPs++;
        }
        
        // Verificar atrasos
        const today = new Date();
        const endDate = new Date(op.data_fim_prevista);
        if (op.status_op !== 'Concluída' && endDate < today) {
          acc.delayedOPs++;
        }
        
        acc.totalCost += Number(op.custo_total || 0);
        acc.averageExecutionDays += Number(op.tempo_execucao_dias || 0);
        
        // Distribuição por status
        acc.statusDistribution[op.status_op] = (acc.statusDistribution[op.status_op] || 0) + 1;
        
        return acc;
      }, {
        totalOPs: 0,
        completedOPs: 0,
        delayedOPs: 0,
        totalCost: 0,
        averageExecutionDays: 0,
        statusDistribution: {} as Record<string, number>
      });

      // Merge chunk stats with total stats
      totalStats.totalOPs += chunkStats.totalOPs;
      totalStats.completedOPs += chunkStats.completedOPs;
      totalStats.delayedOPs += chunkStats.delayedOPs;
      totalStats.totalCost += chunkStats.totalCost;
      totalStats.averageExecutionDays += chunkStats.averageExecutionDays;
      
      Object.entries(chunkStats.statusDistribution).forEach(([status, count]) => {
        totalStats.statusDistribution[status] = (totalStats.statusDistribution[status] || 0) + count;
      });
    }

    // Calcular médias finais
    totalStats.averageExecutionDays = totalStats.completedOPs > 0 
      ? totalStats.averageExecutionDays / totalStats.completedOPs 
      : 0;

    return {
      ...totalStats,
      totalCost: Math.round(totalStats.totalCost * 100) / 100,
      averageExecutionDays: Math.round(totalStats.averageExecutionDays * 100) / 100,
      completionRate: totalStats.totalOPs > 0 
        ? Math.round((totalStats.completedOPs / totalStats.totalOPs) * 100 * 100) / 100 
        : 0,
      delayRate: totalStats.totalOPs > 0 
        ? Math.round((totalStats.delayedOPs / totalStats.totalOPs) * 100 * 100) / 100 
        : 0
    };
  }, []);

  // Memoizar estatísticas processadas
  const opStatistics = useMemo(() => {
    if (!query.data) return null;
    
    // Executar processamento assíncrono
    let stats = null;
    processOPStatistics(query.data).then(result => {
      stats = result;
    });
    
    return stats;
  }, [query.data, processOPStatistics]);

  return {
    ...query,
    opStatistics,
    processOPStatistics
  };
};
