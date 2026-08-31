"use server";

<<<<<<< HEAD
import { createAdminSupabaseClient } from "../../_lib/supabase/admin";

type RegistrationFields = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
};

type RegistrationActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fields: RegistrationFields;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 8;

function getField(formData: FormData, key: keyof RegistrationFields) {
  return String(formData.get(key) ?? "").trim();
}

function getPasswordField(formData: FormData, key: "password" | "confirmPassword") {
  return String(formData.get(key) ?? "");
}

function getRegistrationMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Student registration failed.";
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("registered") ||
    normalizedMessage.includes("duplicate") ||
    normalizedMessage.includes("unique")
  ) {
    return "An account with this email already exists.";
  }

  if (normalizedMessage.includes("password")) {
    return "Use a stronger password and try again.";
  }

  return "We could not create your student account right now. Please try again.";
}

async function registerStudent(
  _previousState: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const fields = {
    name: getField(formData, "name"),
    lastName: getField(formData, "lastName"),
    email: getField(formData, "email").toLowerCase(),
    phone: getField(formData, "phone"),
  };
  const password = getPasswordField(formData, "password");
  const confirmPassword = getPasswordField(formData, "confirmPassword");
=======
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
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)

  if (!fields.name || !fields.lastName || !fields.email || !password) {
    return {
      status: "error",
      message: "Name, last name, email, and password are required.",
<<<<<<< HEAD
=======
      canOpenHub: false,
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      fields,
    };
  }

<<<<<<< HEAD
  if (!emailPattern.test(fields.email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
=======
  if (!isValidEmail(fields.email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
      canOpenHub: false,
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      fields,
    };
  }

<<<<<<< HEAD
  if (password.length < minimumPasswordLength) {
    return {
      status: "error",
      message: `Password must be at least ${minimumPasswordLength} characters.`,
=======
  if (password.length < 8) {
    return {
      status: "error",
      message: "Password must be at least 8 characters.",
      canOpenHub: false,
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      fields,
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "Passwords do not match.",
<<<<<<< HEAD
=======
      canOpenHub: false,
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      fields,
    };
  }

<<<<<<< HEAD
  const admin = createAdminSupabaseClient();
  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: fields.email,
      password,
      email_confirm: true,
      app_metadata: { role: "student" },
      user_metadata: { name: fields.name, lastName: fields.lastName },
    });

  if (authError || !authData.user) {
    return {
      status: "error",
      message: getRegistrationMessage(authError),
      fields,
    };
  }

  const uid = authData.user.id;

  try {
    const { error: profileError } = await admin.from("profiles").insert({
      id: uid,
=======
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
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      role: "student",
      name: fields.name,
      last_name: fields.lastName,
      email: fields.email,
      phone: fields.phone || null,
    });

    if (profileError) {
<<<<<<< HEAD
=======
      await supabase.auth.signOut();
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      throw profileError;
    }

    const { error: studentError } = await admin
      .from("students")
<<<<<<< HEAD
      .insert({ user_id: uid });

    if (studentError) {
=======
      .insert({ user_id: data.user.id });

    if (studentError) {
      await supabase.auth.signOut();
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      throw studentError;
    }

    return {
      status: "success",
<<<<<<< HEAD
      message: "Student account created. You can now sign in.",
      fields: {
        name: "",
        lastName: "",
        email: fields.email,
        phone: "",
      },
    };
  } catch (profileError) {
    await admin.auth.admin.deleteUser(uid);

    return {
      status: "error",
      message: getRegistrationMessage(profileError),
=======
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
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
      fields,
    };
  }
}

<<<<<<< HEAD
export { registerStudent, type RegistrationActionState };
=======
export { registerStudent };
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
