"use client";

import { useState, useEffect } from "react";

export interface SiteStats {
  totalCourses: number;
  totalUsers: number;
  totalEnrollments: number;
  totalPlants: number;
}

export function useSiteStats() {
  const [stats, setStats] = useState<SiteStats>({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalPlants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/stats/site");

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch stats");
        }

        setStats(data.data);
      } catch (err) {
        console.error("Error fetching site stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}


