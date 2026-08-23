"use server";

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

  if (!fields.name || !fields.lastName || !fields.email || !password) {
    return {
      status: "error",
      message: "Name, last name, email, and password are required.",
      fields,
    };
  }

  if (!emailPattern.test(fields.email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
      fields,
    };
  }

  if (password.length < minimumPasswordLength) {
    return {
      status: "error",
      message: `Password must be at least ${minimumPasswordLength} characters.`,
      fields,
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "Passwords do not match.",
      fields,
    };
  }

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
      role: "student",
      name: fields.name,
      last_name: fields.lastName,
      email: fields.email,
      phone: fields.phone || null,
    });

    if (profileError) {
      throw profileError;
    }

    const { error: studentError } = await admin
      .from("students")
      .insert({ user_id: uid });

    if (studentError) {
      throw studentError;
    }

    return {
      status: "success",
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
      fields,
    };
  }
}

export { registerStudent, type RegistrationActionState };
