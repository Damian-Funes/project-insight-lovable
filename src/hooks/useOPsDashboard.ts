
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OPWithDetails {
  id: string;
  numero_op: string;
  descricao_op: string;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  status_op: string;
  observacoes?: string;
  projeto_id: string;
  area_responsavel_id: string;
  projetos: {
    nome_projeto: string;
  };
  areas_produtivas: {
    nome_area: string;
    custo_hora_padrao?: number;
  };
  tempo_execucao_dias?: number;
  custo_total?: number;
}

export interface OPFilters {
  projeto_id?: string;
  area_id?: string;
  status?: string;
  data_inicio_de?: string;
  data_inicio_ate?: string;
}

export const useOPsDashboard = (filters: OPFilters = {}) => {
  return useQuery({
    queryKey: ["ops-dashboard", filters],
    queryFn: async () => {
      console.log("Buscando dados do dashboard de OPs...");

      let query = supabase
        .from("ordem_producao")
        .select(`
          *,
          projetos!inner(nome_projeto),
          areas_produtivas!inner(nome_area, custo_hora_padrao)
        `);

      // Aplicar filtros
      if (filters.projeto_id && filters.projeto_id !== "all") {
        query = query.eq("projeto_id", filters.projeto_id);
      }

      if (filters.area_id && filters.area_id !== "all") {
        query = query.eq("area_responsavel_id", filters.area_id);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status_op", filters.status);
      }

      if (filters.data_inicio_de) {
        query = query.gte("data_inicio_prevista", filters.data_inicio_de);
      }

      if (filters.data_inicio_ate) {
        query = query.lte("data_inicio_prevista", filters.data_inicio_ate);
      }

      query = query.order("created_at", { ascending: false });

      const { data: ops, error } = await query;

      if (error) {
        console.error("Erro ao buscar OPs:", error);
        throw error;
      }

      // Buscar custos associados para OPs concluídas
      const opsWithCosts = await Promise.all(
        (ops || []).map(async (op) => {
          let custo_total = 0;
          let tempo_execucao_dias = 0;

          // Calcular tempo de execução se tiver datas reais
          if (op.data_inicio_real && op.data_fim_real) {
            const inicio = new Date(op.data_inicio_real);
            const fim = new Date(op.data_fim_real);
            tempo_execucao_dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
          }

          // Buscar custos se a OP estiver concluída
          if (op.status_op === "Concluída") {
            const { data: atividades } = await supabase
              .from("registros_atividades")
              .select("horas_gastas")
              .eq("ordem_producao_id", op.id);

            if (atividades && atividades.length > 0) {
              const custoHora = op.areas_produtivas?.custo_hora_padrao || 50;
              custo_total = atividades.reduce((total, ativ) => {
                return total + (ativ.horas_gastas * custoHora);
              }, 0);
            }
          }

          return {
            ...op,
            tempo_execucao_dias,
            custo_total,
          } as OPWithDetails;
        })
      );

      console.log(`OPs encontradas: ${opsWithCosts.length}`);
      return opsWithCosts;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para estatísticas do dashboard
export const useOPsStats = (ops: OPWithDetails[]) => {
  const statusDistribution = ops.reduce((acc, op) => {
    acc[op.status_op] = (acc[op.status_op] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const areaDistribution = ops.reduce((acc, op) => {
    const areaName = op.areas_produtivas?.nome_area || "Não definida";
    acc[areaName] = (acc[areaName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prazoAnalysis = ops
    .filter(op => op.status_op === "Concluída" && op.data_fim_prevista && op.data_fim_real)
    .map(op => {
      const prevista = new Date(op.data_fim_prevista);
      const real = new Date(op.data_fim_real!);
      const diasDiferenca = Math.ceil((real.getTime() - prevista.getTime()) / (1000 * 60 * 60 * 24));
      
      let categoria = "No Prazo";
      if (diasDiferenca < 0) categoria = "Adiantada";
      else if (diasDiferenca > 0) categoria = "Atrasada";

      return {
        id: op.id,
        numero_op: op.numero_op,
        dias_diferenca: diasDiferenca,
        categoria,
      };
    });

  const tempoMedioExecucao = ops
    .filter(op => op.tempo_execucao_dias && op.tempo_execucao_dias > 0)
    .reduce((acc, op, _, arr) => {
      return acc + (op.tempo_execucao_dias! / arr.length);
    }, 0);

  return {
    statusDistribution,
    areaDistribution,
    prazoAnalysis,
    tempoMedioExecucao: Math.round(tempoMedioExecucao * 10) / 10,
    totalOPs: ops.length,
  };
};
