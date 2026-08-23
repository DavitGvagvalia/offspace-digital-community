function throwIfSupabaseError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

function requireSupabaseData<T>(
  data: T | null,
  message = "Supabase did not return data.",
): T {
  if (data === null) {
    throw new Error(message);
  }

  return data;
}

export { requireSupabaseData, throwIfSupabaseError };
