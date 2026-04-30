export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      click_logs: {
        Row: {
          country: string | null
          created_at: string
          id: string
          ip_address: string | null
          source: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          source?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          sender_email: string | null
          sender_name: string
          sender_phone: string | null
          source: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_email?: string | null
          sender_name: string
          sender_phone?: string | null
          source?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          link_url: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          link_url?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          link_url?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          about_p1: string | null
          about_p2: string | null
          about_title_1: string | null
          about_title_2: string | null
          about_title_serious: string | null
          brand_name: string | null
          contact_email: string | null
          contact_location: string | null
          contact_whatsapp_display: string | null
          created_at: string
          hero_badge: string | null
          hero_cta_start: string | null
          hero_cta_view: string | null
          hero_desc: string | null
          hero_stat_clients: string | null
          hero_stat_clients_value: string | null
          hero_stat_projects: string | null
          hero_stat_projects_value: string | null
          hero_stat_uptime: string | null
          hero_stat_uptime_value: string | null
          hero_stat_years: string | null
          hero_stat_years_value: string | null
          hero_title_1: string | null
          hero_title_2: string | null
          hero_title_precision: string | null
          id: string
          is_published: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          about_p1?: string | null
          about_p2?: string | null
          about_title_1?: string | null
          about_title_2?: string | null
          about_title_serious?: string | null
          brand_name?: string | null
          contact_email?: string | null
          contact_location?: string | null
          contact_whatsapp_display?: string | null
          created_at?: string
          hero_badge?: string | null
          hero_cta_start?: string | null
          hero_cta_view?: string | null
          hero_desc?: string | null
          hero_stat_clients?: string | null
          hero_stat_clients_value?: string | null
          hero_stat_projects?: string | null
          hero_stat_projects_value?: string | null
          hero_stat_uptime?: string | null
          hero_stat_uptime_value?: string | null
          hero_stat_years?: string | null
          hero_stat_years_value?: string | null
          hero_title_1?: string | null
          hero_title_2?: string | null
          hero_title_precision?: string | null
          id?: string
          is_published?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          about_p1?: string | null
          about_p2?: string | null
          about_title_1?: string | null
          about_title_2?: string | null
          about_title_serious?: string | null
          brand_name?: string | null
          contact_email?: string | null
          contact_location?: string | null
          contact_whatsapp_display?: string | null
          created_at?: string
          hero_badge?: string | null
          hero_cta_start?: string | null
          hero_cta_view?: string | null
          hero_desc?: string | null
          hero_stat_clients?: string | null
          hero_stat_clients_value?: string | null
          hero_stat_projects?: string | null
          hero_stat_projects_value?: string | null
          hero_stat_uptime?: string | null
          hero_stat_uptime_value?: string | null
          hero_stat_years?: string | null
          hero_stat_years_value?: string | null
          hero_title_1?: string | null
          hero_title_2?: string | null
          hero_title_precision?: string | null
          id?: string
          is_published?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_skills: {
        Row: {
          created_at: string
          group_title: string
          id: string
          is_published: boolean
          items: string[]
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_title: string
          id?: string
          is_published?: boolean
          items?: string[]
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_title?: string
          id?: string
          is_published?: boolean
          items?: string[]
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_settings: {
        Row: {
          greeting_message: string | null
          id: string
          is_enabled: boolean
          phone_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          greeting_message?: string | null
          id?: string
          is_enabled?: boolean
          phone_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          greeting_message?: string | null
          id?: string
          is_enabled?: boolean
          phone_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
