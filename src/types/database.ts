export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string;
          preferred_language: string;
          preferred_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string;
          preferred_language?: string;
          preferred_currency?: string;
        };
        Update: {
          display_name?: string;
          avatar_url?: string;
          preferred_language?: string;
          preferred_currency?: string;
          updated_at?: string;
        };
      };
      fire_plans: {
        Row: {
          id: string;
          user_id: string;
          annual_spending: number;
          withdrawal_rate: number;
          target_amount: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          annual_spending?: number;
          withdrawal_rate?: number;
          target_amount?: number;
          currency?: string;
        };
        Update: {
          annual_spending?: number;
          withdrawal_rate?: number;
          target_amount?: number;
          currency?: string;
          updated_at?: string;
        };
      };
      checkins: {
        Row: {
          id: string;
          plan_id: string;
          user_id: string;
          checkin_date: string;
          current_net_worth: number;
          annual_spending: number;
          note: string;
          created_at: string;
        };
        Insert: {
          plan_id: string;
          user_id: string;
          checkin_date: string;
          current_net_worth: number;
          annual_spending: number;
          note?: string;
        };
        Update: {
          checkin_date?: string;
          current_net_worth?: number;
          annual_spending?: number;
          note?: string;
        };
      };
    };
  };
};
