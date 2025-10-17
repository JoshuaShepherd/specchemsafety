"use client";

import { useAuth } from "./useAuth";
import { UserProfile, UserRole } from "@/lib/supabase/types";

export function useUser() {
  const { user, profile, loading, error } = useAuth();

  // Get user's full name
  const getFullName = (): string => {
    if (!profile) return "";
    return `${profile.first_name} ${profile.last_name}`.trim();
  };

  // Get user's initials
  const getInitials = (): string => {
    if (!profile) return "";
    return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
  };

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return !!user && !!profile;
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return profile?.role === "admin";
  };

  // Check if user is manager
  const isManager = (): boolean => {
    return profile?.role === "plant_manager" || profile?.role === "safety_manager";
  };

  // Check if user is regular user
  const isUser = (): boolean => {
    return profile?.role === "employee";
  };

  // Get user's plant ID
  const getPlantId = (): string | undefined => {
    return profile?.plant_id;
  };

  // Get user's plant name
  const getPlantName = (): string => {
    if (!profile) return "Not assigned";
    
    // Check if profile has plant information
    if ((profile as any).plants) {
      return (profile as any).plants.name || "Unknown Plant";
    }
    
    return "Not assigned";
  };

  // Get user's role
  const getRole = (): UserRole | undefined => {
    return profile?.role as UserRole;
  };

  // Get user's email
  const getEmail = (): string => {
    return user?.email || profile?.email || "";
  };

  // Check if user can access a specific route
  const canAccessRoute = (route: string): boolean => {
    if (!profile) return false;

    // Admin can access everything
    if (profile.role === "admin") return true;

    // Manager can access most routes except user management
    if (profile.role === "plant_manager" || profile.role === "safety_manager") {
      return !route.startsWith("/users");
    }

    // Regular users have limited access
    if (profile.role === "employee") {
      return route.startsWith("/dashboard") || route.startsWith("/courses");
    }

    return false;
  };

  // Get user's permissions summary
  const getPermissions = () => {
    if (!profile) return null;

    const role = profile.role as UserRole;

    return {
      role,
      canManageUsers: role === "admin",
      canManageCourses: role === "admin" || role === "plant_manager" || role === "safety_manager",
      canManagePlants: role === "admin",
      canViewReports: role === "admin" || role === "plant_manager" || role === "safety_manager",
      canManageEnrollments: role === "admin" || role === "plant_manager" || role === "safety_manager",
      canViewAllData: role === "admin",
    };
  };

  return {
    user,
    profile,
    loading,
    error,
    getFullName,
    getInitials,
    isAuthenticated,
    isAdmin,
    isManager,
    isUser,
    getPlantId,
    getPlantName,
    getRole,
    getEmail,
    canAccessRoute,
    getPermissions,
  };
}
