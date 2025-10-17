import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error can be ignored if you are running tests that don't have a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error can be ignored if you are running tests that don't have a Server Component.
          }
        },
      },
    }
  );
});

// Legacy export for backward compatibility
export const createServerSupabaseClient = createClient;

// Server auth helper for API routes
export const serverAuth = {
  async getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, profile: null };
    }

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { user, profile: null };
    }

    return { user, profile };
  }
};
