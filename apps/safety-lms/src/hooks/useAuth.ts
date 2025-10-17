"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type AuthUser, type UserProfile } from "@/lib/supabase/types";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchUserAndProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.warn("Auth error (likely no session):", authError.message);
        // Don't throw for auth errors - just set no user
        setUser(null);
        setProfile(null);
        return;
      }

      if (authUser) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(`
            *,
            plants (
              id,
              name
            )
          `)
          .eq("auth_user_id", authUser.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 means no rows found, which is fine if profile isn't created yet
          console.warn("Profile fetch error:", profileError.message);
          setUser(authUser);
          setProfile(null);
        } else {
          setUser(authUser);
          setProfile(profileData || null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err: any) {
      console.error("Unexpected error fetching user or profile:", err.message);
      setError(err.message || "Failed to fetch user information.");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        fetchUserAndProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserAndProfile]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) throw authError;

      await fetchUserAndProfile(); // Re-fetch user and profile after successful sign-in
      return { success: true, user: data.user };
    } catch (err: any) {
      console.error("Sign-in error:", err.message);
      setError(err.message || "Login failed. Please check your credentials.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      setUser(null);
      setProfile(null);
      router.push("/auth/login");
      return { success: true };
    } catch (err: any) {
      console.error("Sign-out error:", err.message);
      setError(err.message || "Failed to sign out.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`, // Or your update password page
        }
      );
      if (authError) throw authError;
      return { success: true };
    } catch (err: any) {
      console.error("Password reset error:", err.message);
      setError(err.message || "Failed to send password reset email.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated,
  };
}
