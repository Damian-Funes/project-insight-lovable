export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alertas_config: {
        Row: {
          ativo: boolean
          condicao: string
          created_at: string
          destinatarios: string
          id: string
          mensagem_alerta: string
          nome_alerta: string
          tipo_alerta: Database["public"]["Enums"]["tipo_alerta"]
        }
        Insert: {
          ativo?: boolean
          condicao: string
          created_at?: string
          destinatarios: string
          id?: string
          mensagem_alerta: string
          nome_alerta: string
          tipo_alerta: Database["public"]["Enums"]["tipo_alerta"]
        }
        Update: {
          ativo?: boolean
          condicao?: string
          created_at?: string
          destinatarios?: string
          id?: string
          mensagem_alerta?: string
          nome_alerta?: string
          tipo_alerta?: Database["public"]["Enums"]["tipo_alerta"]
        }
        Relationships: []
      }
      alertas_operacionais: {
        Row: {
          area_id: string | null
          ativo: boolean
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string
          id: string
          mensagem: string
          prioridade: number
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          id?: string
          mensagem: string
          prioridade?: number
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          id?: string
          mensagem?: string
          prioridade?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_operacionais_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_produtivas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_operacionais_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      areas_produtivas: {
        Row: {
          created_at: string
          custo_hora_padrao: number | null
          descricao_area: string | null
          id: string
          nome_area: string
        }
        Insert: {
          created_at?: string
          custo_hora_padrao?: number | null
          descricao_area?: string | null
          id?: string
          nome_area: string
        }
        Update: {
          created_at?: string
          custo_hora_padrao?: number | null
          descricao_area?: string | null
          id?: string
          nome_area?: string
        }
        Relationships: []
      }
      cenarios_financeiros: {
        Row: {
          ativo: boolean
          data_criacao: string
          descricao_cenario: string | null
          id: string
          nome_cenario: string
          parametros_simulacao: Json | null
          resultados_simulacao: Json | null
          usuario_id: string
        }
        Insert: {
          ativo?: boolean
          data_criacao?: string
          descricao_cenario?: string | null
          id?: string
          nome_cenario: string
          parametros_simulacao?: Json | null
          resultados_simulacao?: Json | null
          usuario_id: string
        }
        Update: {
          ativo?: boolean
          data_criacao?: string
          descricao_cenario?: string | null
          id?: string
          nome_cenario?: string
          parametros_simulacao?: Json | null
          resultados_simulacao?: Json | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cenarios_financeiros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos_preditivos: {
        Row: {
          created_at: string
          data_treinamento: string | null
          descricao_modelo: string | null
          id: string
          nome_modelo: string
          parametros_modelo: Json | null
          status_modelo: string
          tipo_modelo: string
        }
        Insert: {
          created_at?: string
          data_treinamento?: string | null
          descricao_modelo?: string | null
          id?: string
          nome_modelo: string
          parametros_modelo?: Json | null
          status_modelo?: string
          tipo_modelo: string
        }
        Update: {
          created_at?: string
          data_treinamento?: string | null
          descricao_modelo?: string | null
          id?: string
          nome_modelo?: string
          parametros_modelo?: Json | null
          status_modelo?: string
          tipo_modelo?: string
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          alerta_id: string | null
          contexto_id: string | null
          created_at: string
          data_notificacao: string
          id: string
          lida: boolean
          mensagem: string
          usuario_id: string
        }
        Insert: {
          alerta_id?: string | null
          contexto_id?: string | null
          created_at?: string
          data_notificacao?: string
          id?: string
          lida?: boolean
          mensagem: string
          usuario_id: string
        }
        Update: {
          alerta_id?: string | null
          contexto_id?: string | null
          created_at?: string
          data_notificacao?: string
          id?: string
          lida?: boolean
          mensagem?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_alerta_id_fkey"
            columns: ["alerta_id"]
            isOneToOne: false
            referencedRelation: "alertas_config"
            referencedColumns: ["id"]
          },
        ]
      }
      ordem_producao: {
        Row: {
          area_responsavel_id: string
          created_at: string
          data_fim_prevista: string
          data_fim_real: string | null
          data_inicio_prevista: string
          data_inicio_real: string | null
          descricao_op: string
          id: string
          numero_op: string
          observacoes: string | null
          projeto_id: string
          status_op: string
          updated_at: string
        }
        Insert: {
          area_responsavel_id: string
          created_at?: string
          data_fim_prevista: string
          data_fim_real?: string | null
          data_inicio_prevista: string
          data_inicio_real?: string | null
          descricao_op: string
          id?: string
          numero_op: string
          observacoes?: string | null
          projeto_id: string
          status_op?: string
          updated_at?: string
        }
        Update: {
          area_responsavel_id?: string
          created_at?: string
          data_fim_prevista?: string
          data_fim_real?: string | null
          data_inicio_prevista?: string
          data_inicio_real?: string | null
          descricao_op?: string
          id?: string
          numero_op?: string
          observacoes?: string | null
          projeto_id?: string
          status_op?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordem_producao_area_responsavel_id_fkey"
            columns: ["area_responsavel_id"]
            isOneToOne: false
            referencedRelation: "areas_produtivas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_producao_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          area_id: string | null
          email: string | null
          id: string
          nome: string | null
          nome_completo: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          email?: string | null
          id: string
          nome?: string | null
          nome_completo: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          nome_completo?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_area"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_produtivas"
            referencedColumns: ["id"]
          },
        ]
      }
      projecoes_manuais: {
        Row: {
          ajuste_manual: number
          area_id: string | null
          created_at: string
          data_referencia: string
          id: string
          projeto_id: string | null
          tipo: string
          updated_at: string
          usuario_id: string
          valor_projetado: number
        }
        Insert: {
          ajuste_manual?: number
          area_id?: string | null
          created_at?: string
          data_referencia: string
          id?: string
          projeto_id?: string | null
          tipo: string
          updated_at?: string
          usuario_id: string
          valor_projetado?: number
        }
        Update: {
          ajuste_manual?: number
          area_id?: string | null
          created_at?: string
          data_referencia?: string
          id?: string
          projeto_id?: string | null
          tipo?: string
          updated_at?: string
          usuario_id?: string
          valor_projetado?: number
        }
        Relationships: [
          {
            foreignKeyName: "projecoes_manuais_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_produtivas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projecoes_manuais_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos: {
        Row: {
          created_at: string
          data_inicio: string | null
          data_termino_prevista: string | null
          descricao_projeto: string | null
          id: string
          nome_projeto: string
          orcamento_total: number | null
          status_projeto: string | null
        }
        Insert: {
          created_at?: string
          data_inicio?: string | null
          data_termino_prevista?: string | null
          descricao_projeto?: string | null
          id?: string
          nome_projeto: string
          orcamento_total?: number | null
          status_projeto?: string | null
        }
        Update: {
          created_at?: string
          data_inicio?: string | null
          data_termino_prevista?: string | null
          descricao_projeto?: string | null
          id?: string
          nome_projeto?: string
          orcamento_total?: number | null
          status_projeto?: string | null
        }
        Relationships: []
      }
      receitas: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_receita: string
          descricao_receita: string | null
          id: string
          projeto_id: string
          tipo_receita: string | null
          valor_receita: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_receita: string
          descricao_receita?: string | null
          id?: string
          projeto_id: string
          tipo_receita?: string | null
          valor_receita: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_receita?: string
          descricao_receita?: string | null
          id?: string
          projeto_id?: string
          tipo_receita?: string | null
          valor_receita?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_receitas_projeto"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_atividades: {
        Row: {
          area_id: string
          created_at: string
          data_registro: string
          descricao_atividade: string | null
          horas_gastas: number
          id: string
          ordem_producao_id: string | null
          projeto_id: string
          responsavel_id: string
          tipo_atividade: string | null
        }
        Insert: {
          area_id: string
          created_at?: string
          data_registro: string
          descricao_atividade?: string | null
          horas_gastas: number
          id?: string
          ordem_producao_id?: string | null
          projeto_id: string
          responsavel_id: string
          tipo_atividade?: string | null
        }
        Update: {
          area_id?: string
          created_at?: string
          data_registro?: string
          descricao_atividade?: string | null
          horas_gastas?: number
          id?: string
          ordem_producao_id?: string | null
          projeto_id?: string
          responsavel_id?: string
          tipo_atividade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_atividades_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_produtivas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_atividades_ordem_producao_id_fkey"
            columns: ["ordem_producao_id"]
            isOneToOne: false
            referencedRelation: "ordem_producao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_atividades_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_atividades_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_preditivos: {
        Row: {
          created_at: string
          data_previsao: string
          detalhes_anomalia: string | null
          id: string
          intervalo_confianca_max: number | null
          intervalo_confianca_min: number | null
          modelo_id: string
          tipo_previsao: string
          valor_previsto: number | null
        }
        Insert: {
          created_at?: string
          data_previsao: string
          detalhes_anomalia?: string | null
          id?: string
          intervalo_confianca_max?: number | null
          intervalo_confianca_min?: number | null
          modelo_id: string
          tipo_previsao: string
          valor_previsto?: number | null
        }
        Update: {
          created_at?: string
          data_previsao?: string
          detalhes_anomalia?: string | null
          id?: string
          intervalo_confianca_max?: number | null
          intervalo_confianca_min?: number | null
          modelo_id?: string
          tipo_previsao?: string
          valor_previsto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resultados_preditivos_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "modelos_preditivos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      atualizar_previsoes_custos: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      calcular_previsao_custos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_existing_op_alerts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_pending_activity_alerts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_pending_alerts_on_login: {
        Args: { user_id: string }
        Returns: undefined
      }
      detectar_anomalias: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      executar_deteccao_anomalias: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      tipo_alerta:
        | "Orçamento Excedido"
        | "Prazo Próximo"
        | "Registro Pendente"
        | "Outros"
      user_role: "admin" | "lider_area" | "funcionario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tipo_alerta: [
        "Orçamento Excedido",
        "Prazo Próximo",
        "Registro Pendente",
        "Outros",
      ],
      user_role: ["admin", "lider_area", "funcionario"],
    },
  },
} as const
