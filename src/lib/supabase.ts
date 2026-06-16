import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if keys are properly configured
export const isSupabaseConfigured = 
  supabaseUrl.length > 0 && 
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes("your-project-id");

// Instantiate the Supabase client (only if credentials exist, otherwise export a dummy/null client or helper)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to sync user profile into the database.
 * If user profile exists, it does nothing. Otherwise it inserts a default client profile.
 */
export async function syncUserProfile(user: { id: string; email?: string; user_metadata?: { full_name?: string } }) {
  if (!supabase) return null;
  
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching profile during sync:", fetchError);
      return null;
    }

    if (!existingProfile) {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          role: "client",
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating profile during sync:", insertError);
        return null;
      }
      return newProfile;
    }

    return existingProfile;
  } catch (err) {
    console.error("Failed to sync profile:", err);
    return null;
  }
}
