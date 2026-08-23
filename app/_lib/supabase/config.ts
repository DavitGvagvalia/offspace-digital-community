const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getSupabasePublicConfig() {
  const missingConfig = [
    ["NEXT_PUBLIC_SUPABASE_URL", supabaseUrl],
    ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", supabasePublishableKey],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing Supabase public configuration: ${missingConfig.join(", ")}`,
    );
  }

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing Supabase public configuration.");
  }

  return {
    url: supabaseUrl,
    publishableKey: supabasePublishableKey,
  };
}

function getSupabaseSecretKey() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing Supabase secret key.");
  }

  return secretKey;
}

export { getSupabasePublicConfig, getSupabaseSecretKey };
