export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.17';
  };
  public: {
    Tables: {
      attendances: {
        Row: {
          created_at: string;
          created_by: string | null;
          event_id: string;
          profile_id: string;
          status: Database['public']['Enums']['attendance_status'];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          event_id: string;
          profile_id: string;
          status: Database['public']['Enums']['attendance_status'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          event_id?: string;
          profile_id?: string;
          status?: Database['public']['Enums']['attendance_status'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'attendances_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendances_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_instances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendances_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendances_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      drill_drill_types: {
        Row: {
          created_at: string;
          created_by: string | null;
          drill_id: string;
          drill_type: Database['public']['Enums']['drill_type'];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          drill_id: string;
          drill_type: Database['public']['Enums']['drill_type'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          drill_id?: string;
          drill_type?: Database['public']['Enums']['drill_type'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'drill_drill_types_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'drill_drill_types_drill_id_fkey';
            columns: ['drill_id'];
            isOneToOne: false;
            referencedRelation: 'drills';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'drill_drill_types_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      drills: {
        Row: {
          author_id: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          duration_minutes: number;
          id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          author_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          duration_minutes: number;
          id?: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          author_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'drills_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'drills_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'drills_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      event_coaches: {
        Row: {
          created_at: string;
          created_by: string | null;
          event_id: string;
          is_primary: boolean;
          profile_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          event_id: string;
          is_primary?: boolean;
          profile_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          event_id?: string;
          is_primary?: boolean;
          profile_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_coaches_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_coaches_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_instances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_coaches_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_coaches_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      event_instances: {
        Row: {
          created_at: string;
          created_by: string | null;
          date_end: string | null;
          date_start: string;
          description: string | null;
          end_time: string;
          event_type: Database['public']['Enums']['event_type'];
          id: string;
          location_id: string | null;
          notes: string | null;
          original_start_time: string | null;
          series_id: string | null;
          start_time: string;
          status: Database['public']['Enums']['event_status'];
          title: string;
          topics: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          date_end?: string | null;
          date_start: string;
          description?: string | null;
          end_time: string;
          event_type: Database['public']['Enums']['event_type'];
          id?: string;
          location_id?: string | null;
          notes?: string | null;
          original_start_time?: string | null;
          series_id?: string | null;
          start_time: string;
          status?: Database['public']['Enums']['event_status'];
          title: string;
          topics?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          date_end?: string | null;
          date_start?: string;
          description?: string | null;
          end_time?: string;
          event_type?: Database['public']['Enums']['event_type'];
          id?: string;
          location_id?: string | null;
          notes?: string | null;
          original_start_time?: string | null;
          series_id?: string | null;
          start_time?: string;
          status?: Database['public']['Enums']['event_status'];
          title?: string;
          topics?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_instances_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_instances_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_instances_series_id_fkey';
            columns: ['series_id'];
            isOneToOne: false;
            referencedRelation: 'event_series';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_instances_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      event_medics: {
        Row: {
          created_at: string;
          created_by: string | null;
          event_id: string;
          profile_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          event_id: string;
          profile_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          event_id?: string;
          profile_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_medics_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_medics_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_instances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_medics_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_medics_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      event_series: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          end_time: string;
          id: string;
          location_id: string | null;
          recurrence_rule: string;
          series_date_end: string | null;
          series_date_start: string;
          start_time: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_time: string;
          id?: string;
          location_id?: string | null;
          recurrence_rule: string;
          series_date_end?: string | null;
          series_date_start: string;
          start_time: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_time?: string;
          id?: string;
          location_id?: string | null;
          recurrence_rule?: string;
          series_date_end?: string | null;
          series_date_start?: string;
          start_time?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_series_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_series_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_series_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      event_teams: {
        Row: {
          created_at: string;
          created_by: string | null;
          event_id: string;
          team_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          event_id: string;
          team_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          event_id?: string;
          team_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_teams_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_teams_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_instances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_teams_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_teams_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      guardian_relationships: {
        Row: {
          child_profile_id: string;
          created_at: string;
          created_by: string | null;
          guardian_profile_id: string;
          id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          child_profile_id: string;
          created_at?: string;
          created_by?: string | null;
          guardian_profile_id: string;
          id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          child_profile_id?: string;
          created_at?: string;
          created_by?: string | null;
          guardian_profile_id?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'guardian_relationships_child_profile_id_fkey';
            columns: ['child_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guardian_relationships_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guardian_relationships_guardian_profile_id_fkey';
            columns: ['guardian_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guardian_relationships_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      locations: {
        Row: {
          address: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          is_default: boolean;
          name: string;
          notes: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_default?: boolean;
          name: string;
          notes?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_default?: boolean;
          name?: string;
          notes?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'locations_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'locations_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_log: {
        Row: {
          channel: Database['public']['Enums']['notification_channel'];
          created_at: string;
          created_by: string | null;
          event_id: string | null;
          id: string;
          profile_id: string;
          sent_at: string;
          status: Database['public']['Enums']['notification_status'];
          type: Database['public']['Enums']['notification_type'];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          channel: Database['public']['Enums']['notification_channel'];
          created_at?: string;
          created_by?: string | null;
          event_id?: string | null;
          id?: string;
          profile_id: string;
          sent_at?: string;
          status: Database['public']['Enums']['notification_status'];
          type: Database['public']['Enums']['notification_type'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          channel?: Database['public']['Enums']['notification_channel'];
          created_at?: string;
          created_by?: string | null;
          event_id?: string | null;
          id?: string;
          profile_id?: string;
          sent_at?: string;
          status?: Database['public']['Enums']['notification_status'];
          type?: Database['public']['Enums']['notification_type'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_log_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notification_log_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_instances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notification_log_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notification_log_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_user_types: {
        Row: {
          created_at: string;
          created_by: string | null;
          profile_id: string;
          updated_at: string;
          updated_by: string | null;
          user_type: Database['public']['Enums']['user_type'];
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          profile_id: string;
          updated_at?: string;
          updated_by?: string | null;
          user_type: Database['public']['Enums']['user_type'];
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          profile_id?: string;
          updated_at?: string;
          updated_by?: string | null;
          user_type?: Database['public']['Enums']['user_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'profile_user_types_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_user_types_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_user_types_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          created_by: string | null;
          derby_name: string | null;
          first_name: string;
          id: string;
          last_name: string;
          phone: string | null;
          preferred_name: string | null;
          skater_number: string | null;
          status: Database['public']['Enums']['profile_status'];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          derby_name?: string | null;
          first_name: string;
          id: string;
          last_name: string;
          phone?: string | null;
          preferred_name?: string | null;
          skater_number?: string | null;
          status?: Database['public']['Enums']['profile_status'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          derby_name?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string | null;
          preferred_name?: string | null;
          skater_number?: string | null;
          status?: Database['public']['Enums']['profile_status'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      push_tokens: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          last_seen_at: string;
          platform: Database['public']['Enums']['push_platform'];
          profile_id: string;
          token: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          last_seen_at?: string;
          platform: Database['public']['Enums']['push_platform'];
          profile_id: string;
          token: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          last_seen_at?: string;
          platform?: Database['public']['Enums']['push_platform'];
          profile_id?: string;
          token?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'push_tokens_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'push_tokens_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'push_tokens_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      registrations: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          notes: string | null;
          profile_id: string;
          registered_at: string;
          status: Database['public']['Enums']['registration_status'];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          notes?: string | null;
          profile_id: string;
          registered_at?: string;
          status?: Database['public']['Enums']['registration_status'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          notes?: string | null;
          profile_id?: string;
          registered_at?: string;
          status?: Database['public']['Enums']['registration_status'];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'registrations_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registrations_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registrations_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      rosters: {
        Row: {
          created_at: string;
          created_by: string | null;
          event_id: string;
          is_alternate: boolean;
          profile_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          event_id: string;
          is_alternate?: boolean;
          profile_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          event_id?: string;
          is_alternate?: boolean;
          profile_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rosters_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rosters_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_instances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rosters_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rosters_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      team_members: {
        Row: {
          created_at: string;
          created_by: string | null;
          profile_id: string;
          team_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          profile_id: string;
          team_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          profile_id?: string;
          team_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'team_members_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_members_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_members_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_members_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teams_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_user_type: {
        Args: { t: Database['public']['Enums']['user_type'] };
        Returns: boolean;
      };
      is_admin: { Args: never; Returns: boolean };
      is_event_coach: { Args: { eid: string }; Returns: boolean };
      is_guardian_of: { Args: { child_id: string }; Returns: boolean };
    };
    Enums: {
      attendance_status: 'present' | 'partial' | 'absent' | 'excused';
      drill_type: 'jamming' | 'blocking' | 'endurance' | 'offense';
      event_status: 'scheduled' | 'cancelled';
      event_type: 'game' | 'practice' | 'scrimmage' | 'other';
      notification_channel: 'push' | 'email';
      notification_status: 'sent' | 'failed';
      notification_type:
        'event_created' | 'event_updated' | 'event_cancelled' | 'registration_status_changed';
      profile_status: 'active' | 'inactive';
      push_platform: 'ios' | 'android' | 'web';
      registration_status: 'pending' | 'approved' | 'waitlisted' | 'rejected';
      user_type: 'guardian' | 'skater' | 'coach' | 'trainer' | 'medic' | 'official' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      attendance_status: ['present', 'partial', 'absent', 'excused'],
      drill_type: ['jamming', 'blocking', 'endurance', 'offense'],
      event_status: ['scheduled', 'cancelled'],
      event_type: ['game', 'practice', 'scrimmage', 'other'],
      notification_channel: ['push', 'email'],
      notification_status: ['sent', 'failed'],
      notification_type: [
        'event_created',
        'event_updated',
        'event_cancelled',
        'registration_status_changed',
      ],
      profile_status: ['active', 'inactive'],
      push_platform: ['ios', 'android', 'web'],
      registration_status: ['pending', 'approved', 'waitlisted', 'rejected'],
      user_type: ['guardian', 'skater', 'coach', 'trainer', 'medic', 'official', 'admin'],
    },
  },
} as const;
