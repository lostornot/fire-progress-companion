import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type FirePlan = Database["public"]["Tables"]["fire_plans"]["Row"];
type Checkin = Database["public"]["Tables"]["checkins"]["Row"];

const supabase = createClient();

// --- Auth ---

export async function signInWithProvider(provider: "google" | "apple") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: unknown) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

// --- Profile ---

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

// --- Fire Plans ---

export async function getFirePlan(userId: string): Promise<FirePlan | null> {
  const { data } = await supabase
    .from("fire_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function upsertFirePlan(plan: Partial<FirePlan> & { user_id: string }) {
  if (plan.id) {
    const { error } = await supabase
      .from("fire_plans")
      .update({ ...plan, updated_at: new Date().toISOString() })
      .eq("id", plan.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("fire_plans")
      .insert(plan);
    if (error) throw error;
  }
}

// --- Checkins ---

export async function getCheckins(userId: string): Promise<Checkin[]> {
  const { data } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", userId)
    .order("checkin_date", { ascending: true });
  return data ?? [];
}

export async function upsertCheckin(checkin: Partial<Checkin> & { plan_id: string; user_id: string }) {
  if (checkin.id) {
    const { error } = await supabase
      .from("checkins")
      .update(checkin)
      .eq("id", checkin.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("checkins")
      .insert(checkin);
    if (error) throw error;
  }
}
