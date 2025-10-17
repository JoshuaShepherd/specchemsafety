"use client";

import { useState, useEffect } from "react";

export interface DashboardStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  certificates: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEnrollments: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/stats/dashboard");

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch stats");
        }

        setStats(data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => {} };
}


