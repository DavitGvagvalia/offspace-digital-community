import type { AuthError, User } from "@supabase/supabase-js";

import { createClient } from "./client";

async function loginWithEmailAndPassword(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("No authenticated user returned.");
  }

  return data.user;
}

async function getCurrentAuthUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user ?? null;
}

function subscribeToAuthState(callback: (user: User | null) => void) {
  const supabase = createClient();

  supabase.auth.getUser().then(({ data }) => {
    callback(data.user ?? null);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}

async function signOutCurrentUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

function getSupabaseAuthMessage(error: unknown) {
  const authError = error as Partial<AuthError>;
  const errorMessage =
    error instanceof Error ? error.message : authError.message ?? "";
  const normalizedMessage = errorMessage.toLowerCase();

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("email not confirmed")
  ) {
    return "The email or password is incorrect.";
  }

  if (normalizedMessage.includes("missing supabase public configuration")) {
    return "Supabase is not configured for this deployment. Check the public Supabase environment variables in Vercel and redeploy.";
  }

  if (
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("fetch failed") ||
    normalizedMessage.includes("networkerror")
  ) {
    return "We could not reach Supabase Auth. Check the deployed Supabase URL and publishable key.";
  }

  return "We could not sign you in right now. Please try again.";
}

export {
  getCurrentAuthUser,
  getSupabaseAuthMessage,
  loginWithEmailAndPassword,
  signOutCurrentUser,
  subscribeToAuthState,
};
