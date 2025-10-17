"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title?: string;
  role: "admin" | "safety_manager" | "plant_manager" | "employee";
  status: "active" | "suspended";
  plant_id?: string;
  plant_name?: string;
  auth_user_id?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  is_active: boolean;
}

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profiles with plant information
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          email,
          job_title,
          role,
          status,
          plant_id,
          auth_user_id,
          created_at,
          updated_at,
          plants (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      // Fetch last login information from auth.users
      const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.warn("Could not fetch auth users:", authError);
      }

      // Transform the data
      const transformedUsers: User[] = (profilesData || []).map((profile) => {
        const authUser = authUsersData?.users?.find(
          (u: any) => u.id === profile.auth_user_id
        );

        // Handle plant name - could be a single plant object or an array
        const plantName = Array.isArray(profile.plants) 
          ? profile.plants[0]?.name 
          : (profile.plants as any)?.name;

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          job_title: profile.job_title,
          role: profile.role,
          status: profile.status,
          plant_id: profile.plant_id,
          plant_name: plantName,
          auth_user_id: profile.auth_user_id,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          last_login_at: authUser?.last_sign_in_at,
          is_active: profile.status === "active",
        };
      });

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
