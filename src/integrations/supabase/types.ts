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
      registros_atividades: {
        Row: {
          area_id: string
          created_at: string
          data_registro: string
          descricao_atividade: string | null
          horas_gastas: number
          id: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
      user_role: ["admin", "lider_area", "funcionario"],
    },
  },
} as const
