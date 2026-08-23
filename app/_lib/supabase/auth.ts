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

  if (
    authError.message?.toLowerCase().includes("invalid login credentials") ||
    authError.message?.toLowerCase().includes("email not confirmed")
  ) {
    return "The email or password is incorrect.";
  }

  return "We could not sign you in right now. Please try again.";
}

export {
  getSupabaseAuthMessage,
  loginWithEmailAndPassword,
  signOutCurrentUser,
  subscribeToAuthState,
};
