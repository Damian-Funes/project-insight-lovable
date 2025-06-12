
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfitabilityFilters {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}

export interface ProjectProfitability {
  projeto_id: string;
  nome_projeto: string;
  receita_total: number;
  custo_total: number;
  lucro: number;
  margem_lucro: number;
}

export const useProfitabilityData = (filters?: ProfitabilityFilters) => {
  return useQuery({
    queryKey: ["profitability-data", filters],
    queryFn: async () => {
      console.log("Buscando dados de rentabilidade com filtros:", filters);
      
      try {
        // Buscar receitas
        let revenueQuery = supabase
          .from("receitas")
          .select(`
            projeto_id,
            valor_receita,
            data_receita,
            projetos (
              nome_projeto
            )
          `);

        if (filters?.startDate) {
          revenueQuery = revenueQuery.gte('data_receita', filters.startDate.toISOString().split('T')[0]);
        }
        if (filters?.endDate) {
          revenueQuery = revenueQuery.lte('data_receita', filters.endDate.toISOString().split('T')[0]);
        }
        if (filters?.projectId && filters.projectId !== 'all') {
          revenueQuery = revenueQuery.eq('projeto_id', filters.projectId);
        }

        const { data: revenueData, error: revenueError } = await revenueQuery;

        if (revenueError) {
          console.error("Erro ao buscar receitas:", revenueError);
          throw revenueError;
        }

        // Buscar custos (atividades)
        let costQuery = supabase
          .from("registros_atividades")
          .select(`
            projeto_id,
            horas_gastas,
            data_registro,
            projetos (
              nome_projeto
            ),
            areas_produtivas (
              custo_hora_padrao
            )
          `);

        if (filters?.startDate) {
          costQuery = costQuery.gte('data_registro', filters.startDate.toISOString().split('T')[0]);
        }
        if (filters?.endDate) {
          costQuery = costQuery.lte('data_registro', filters.endDate.toISOString().split('T')[0]);
        }
        if (filters?.projectId && filters.projectId !== 'all') {
          costQuery = costQuery.eq('projeto_id', filters.projectId);
        }

        const { data: costData, error: costError } = await costQuery;

        if (costError) {
          console.error("Erro ao buscar custos:", costError);
          throw costError;
        }

        console.log("Dados de receita encontrados:", revenueData);
        console.log("Dados de custo encontrados:", costData);

        // Se não há dados de receita nem de custo, retornar array vazio
        if ((!revenueData || revenueData.length === 0) && (!costData || costData.length === 0)) {
          console.log("Nenhum dado encontrado para rentabilidade");
          return [];
        }

        // Agrupar receitas por projeto
        const revenueByProject = (revenueData || []).reduce((acc, record) => {
          const projectId = record.projeto_id;
          const projectName = record.projetos?.nome_projeto;
          const revenue = Number(record.valor_receita) || 0;

          if (!acc[projectId]) {
            acc[projectId] = {
              projeto_id: projectId,
              nome_projeto: projectName || 'Projeto sem nome',
              receita_total: 0
            };
          }
          acc[projectId].receita_total += revenue;

          return acc;
        }, {} as Record<string, any>);

        // Agrupar custos por projeto
        const costByProject = (costData || []).reduce((acc, record) => {
          const projectId = record.projeto_id;
          const projectName = record.projetos?.nome_projeto;
          const hourCost = record.areas_produtivas?.custo_hora_padrao || 0;
          const hours = Number(record.horas_gastas) || 0;
          const totalCost = hours * Number(hourCost);

          if (!acc[projectId]) {
            acc[projectId] = {
              projeto_id: projectId,
              nome_projeto: projectName || 'Projeto sem nome',
              custo_total: 0
            };
          }
          acc[projectId].custo_total += totalCost;

          return acc;
        }, {} as Record<string, any>);

        // Combinar dados e calcular rentabilidade
        const allProjectIds = new Set([
          ...Object.keys(revenueByProject),
          ...Object.keys(costByProject)
        ]);

        // Se não há projetos, retornar array vazio
        if (allProjectIds.size === 0) {
          console.log("Nenhum projeto encontrado para cálculo de rentabilidade");
          return [];
        }

        const profitabilityData: ProjectProfitability[] = Array.from(allProjectIds).map(projectId => {
          const revenue = revenueByProject[projectId] || { receita_total: 0, nome_projeto: 'Projeto sem nome' };
          const cost = costByProject[projectId] || { custo_total: 0, nome_projeto: 'Projeto sem nome' };
          
          const receita_total = revenue.receita_total;
          const custo_total = cost.custo_total;
          const lucro = receita_total - custo_total;
          const margem_lucro = receita_total > 0 ? (lucro / receita_total) * 100 : 0;

          return {
            projeto_id: projectId,
            nome_projeto: revenue.nome_projeto || cost.nome_projeto,
            receita_total: Math.round(receita_total * 100) / 100,
            custo_total: Math.round(custo_total * 100) / 100,
            lucro: Math.round(lucro * 100) / 100,
            margem_lucro: Math.round(margem_lucro * 100) / 100
          };
        });

        console.log("Dados de rentabilidade calculados:", profitabilityData);
        return profitabilityData;
      } catch (error) {
        console.error("Erro no hook useProfitabilityData:", error);
        // Retornar array vazio em caso de erro para evitar quebra da aplicação
        return [];
      }
    },
  });
};
