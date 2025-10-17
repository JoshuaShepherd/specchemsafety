import { User } from "@supabase/supabase-js";

// Authentication types
export interface AuthUser extends User {
  id: string;
  email?: string;
  role?: string;
}

export type UserRole =
  | "admin"
  | "safety_manager"
  | "plant_manager"
  | "employee";

export interface UserProfile {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  plant_id?: string;
  job_title?: string;
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: UserProfile;
  access_token: string;
  refresh_token: string;
}

// Auth state types
export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

// Auth action types
export type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: AuthUser | null }
  | { type: "SET_PROFILE"; payload: UserProfile | null }
  | { type: "SET_SESSION"; payload: AuthSession | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SIGN_OUT" };

// Role-based access control types

export interface RolePermissions {
  canManageUsers: boolean;
  canManageCourses: boolean;
  canManagePlants: boolean;
  canViewReports: boolean;
  canManageEnrollments: boolean;
  canViewAllData: boolean;
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageCourses: boolean;
  canManagePlants: boolean;
  canViewReports: boolean;
  canManageEnrollments: boolean;
  canViewAllData: boolean;
  // Add more specific permissions as needed
}

// Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canManageCourses: true,
    canManagePlants: true,
    canViewReports: true,
    canManageEnrollments: true,
    canViewAllData: true,
  },
  safety_manager: {
    canManageUsers: true,
    canManageCourses: true,
    canManagePlants: false, // Managers might not manage plants directly
    canViewReports: true,
    canManageEnrollments: true,
    canViewAllData: false, // Limited to their scope
  },
  plant_manager: {
    canManageUsers: true, // Can manage users within their plant
    canManageCourses: false,
    canManagePlants: true, // Can manage their own plant details
    canViewReports: true, // Reports specific to their plant
    canManageEnrollments: true,
    canViewAllData: false, // Limited to their plant
  },
  employee: {
    canManageUsers: false,
    canManageCourses: false,
    canManagePlants: false,
    canViewReports: false,
    canManageEnrollments: true, // Can enroll/unenroll themselves
    canViewAllData: false,
  },
};

// Auth error types
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>;
      };
      plants: {
        Row: {
          id: string;
          name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          is_active?: boolean;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          duration_minutes: number;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          duration_minutes?: number;
          is_active?: boolean;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
          completed_at?: string;
          progress_percentage: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          course_id: string;
          enrolled_at?: string;
          progress_percentage?: number;
          is_active?: boolean;
        };
        Update: {
          completed_at?: string;
          progress_percentage?: number;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
