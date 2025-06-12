
import { useMutation, useQueryClient, MutationOptions } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface OptimisticMutationConfig<TData, TVariables> extends Omit<MutationOptions<TData, Error, TVariables>, 'mutationFn'> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: (string | number | object)[];
  optimisticUpdate?: (oldData: any, variables: TVariables) => any;
  successMessage?: string;
  errorMessage?: string;
}

export const useOptimisticMutation = <TData, TVariables>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  successMessage,
  errorMessage,
  ...options
}: OptimisticMutationConfig<TData, TVariables>) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancela queries em andamento para evitar sobrescrever o update otimista
      await queryClient.cancelQueries({ queryKey });

      // Snapshot do valor anterior
      const previousData = queryClient.getQueryData(queryKey);

      // Aplica update otimista se fornecido
      if (optimisticUpdate && previousData) {
        queryClient.setQueryData(queryKey, optimisticUpdate(previousData, variables));
      }

      // Retorna o contexto com os dados anteriores
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Reverte para os dados anteriores em caso de erro
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      toast({
        title: "Erro",
        description: errorMessage || "Ocorreu um erro inesperado",
        variant: "destructive",
      });

      // Chama o onError personalizado se fornecido
      options.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      toast({
        title: "Sucesso",
        description: successMessage || "Operação realizada com sucesso",
      });

      // Chama o onSuccess personalizado se fornecido
      options.onSuccess?.(data, variables, context);
    },
    onSettled: () => {
      // Invalida e refetch para sincronizar com o servidor
      queryClient.invalidateQueries({ queryKey });
      
      // Chama o onSettled personalizado se fornecido
      options.onSettled?.();
    },
    ...options,
  });
};

export const useOptimisticCreate = <TData, TVariables>(config: OptimisticMutationConfig<TData, TVariables>) => {
  return useOptimisticMutation({
    ...config,
    optimisticUpdate: (oldData: TData[], variables: TVariables) => {
      // Adiciona o novo item temporário no início da lista
      const tempItem = {
        ...variables,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        isOptimistic: true,
      };
      return [tempItem, ...oldData];
    },
  });
};

export const useOptimisticUpdate = <TData, TVariables extends { id: string }>(
  config: OptimisticMutationConfig<TData, TVariables>
) => {
  return useOptimisticMutation({
    ...config,
    optimisticUpdate: (oldData: TData[], variables: TVariables) => {
      return oldData.map((item: any) =>
        item.id === variables.id ? { ...item, ...variables } : item
      );
    },
  });
};

export const useOptimisticDelete = <TData, TVariables extends { id: string }>(
  config: OptimisticMutationConfig<TData, TVariables>
) => {
  return useOptimisticMutation({
    ...config,
    optimisticUpdate: (oldData: TData[], variables: TVariables) => {
      return oldData.filter((item: any) => item.id !== variables.id);
    },
  });
};
