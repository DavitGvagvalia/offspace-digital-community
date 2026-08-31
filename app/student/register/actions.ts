"use server";

import { headers } from "next/headers";

import { createAdminSupabaseClient } from "../../_lib/supabase/admin";
import { createServerSupabaseClient } from "../../_lib/supabase/server";

export type StudentRegistrationState = {
  status: "idle" | "success" | "error";
  message: string;
  canOpenHub: boolean;
  fields: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
  };
};

function readFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRegistrationErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("user already registered")) {
    return "An account may already exist for this email. Try logging in instead.";
  }

  if (message.includes("password")) {
    return "Use a stronger password and try again.";
  }

  if (message.includes("missing supabase")) {
    return "Supabase is not configured for this deployment.";
  }

  return "We could not create your account right now. Please try again.";
}

async function getEmailRedirectTo() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return `${origin}/student/login`;
  }

  const host = headerStore.get("host");

  if (!host) {
    return undefined;
  }

  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}/student/login`;
}

async function registerStudent(
  _previousState: StudentRegistrationState,
  formData: FormData,
): Promise<StudentRegistrationState> {
  const fields = {
    name: readFormValue(formData, "name"),
    lastName: readFormValue(formData, "lastName"),
    email: readFormValue(formData, "email").toLowerCase(),
    phone: readFormValue(formData, "phone"),
  };
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!fields.name || !fields.lastName || !fields.email || !password) {
    return {
      status: "error",
      message: "Name, last name, email, and password are required.",
      canOpenHub: false,
      fields,
    };
  }

  if (!isValidEmail(fields.email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
      canOpenHub: false,
      fields,
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Password must be at least 8 characters.",
      canOpenHub: false,
      fields,
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "Passwords do not match.",
      canOpenHub: false,
      fields,
    };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: fields.email,
      password,
      options: {
        data: {
          name: fields.name,
          lastName: fields.lastName,
          role: "student",
        },
        emailRedirectTo: await getEmailRedirectTo(),
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Supabase did not return a created user.");
    }

    const admin = createAdminSupabaseClient();

    const { error: profileError } = await admin.from("profiles").insert({
      id: data.user.id,
      role: "student",
      name: fields.name,
      last_name: fields.lastName,
      email: fields.email,
      phone: fields.phone || null,
    });

    if (profileError) {
      await supabase.auth.signOut();
      throw profileError;
    }

    const { error: studentError } = await admin
      .from("students")
      .insert({ user_id: data.user.id });

    if (studentError) {
      await supabase.auth.signOut();
      throw studentError;
    }

    return {
      status: "success",
      message: data.session
        ? "Your account is ready. Continue to your student hub."
        : "Your account was created. Check your email to confirm access, then log in.",
      canOpenHub: Boolean(data.session),
      fields: {
        name: "",
        lastName: "",
        email: "",
        phone: "",
      },
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: getRegistrationErrorMessage(error),
      canOpenHub: false,
      fields,
    };
  }
}

export { registerStudent };
