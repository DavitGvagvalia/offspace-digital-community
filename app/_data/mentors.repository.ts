import { createClient } from "../_lib/supabase/client";
import { nowTimestamp } from "../_lib/dates";
import { mapMentor } from "../_lib/supabase/mappers";
import type { CreateMentor, Mentor } from "../_types/mentor";
import { throwIfSupabaseError } from "./supabase-errors";

const getMentors = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .is("deleted_at", null)
    .order("created_at");

  throwIfSupabaseError(error);

  const mentors = await Promise.all(
    (data ?? []).map(async (mentor) => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", mentor.user_id)
        .eq("role", "mentor")
        .is("deleted_at", null)
        .maybeSingle();

      throwIfSupabaseError(profileError);

      return profile ? mapMentor(profile, { active: mentor.active }) : null;
    }),
  );

  return mentors.filter((mentor): mentor is Mentor => Boolean(mentor));
};

const getMentor = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .eq("user_id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  if (!data) {
    return null;
  }
  console.log("this is mentor ",data)

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    // .eq("id", id)
    .eq("role", "mentor")
    // .is("deleted_at", null)
    .maybeSingle();
    

  throwIfSupabaseError(profileError);
  console.log("this is profile of mentor ", profile)
  return profile ? mapMentor(profile, { active: data.active }) : null;
};

const addMentor = async (mentor: CreateMentor) => {
  void mentor;
  throw new Error(
    "Mentors must be created through Supabase Auth by a super-admin.",
  );
};

const updateMentor = async (id: string, mentor: Partial<CreateMentor>) => {
  const supabase = createClient();

  if (
    mentor.name !== undefined ||
    mentor.lastName !== undefined ||
    mentor.email !== undefined ||
    mentor.phone !== undefined
  ) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        ...(mentor.name !== undefined ? { name: mentor.name } : {}),
        ...(mentor.lastName !== undefined
          ? { last_name: mentor.lastName }
          : {}),
        ...(mentor.email !== undefined ? { email: mentor.email } : {}),
        ...(mentor.phone !== undefined ? { phone: mentor.phone } : {}),
        updated_at: nowTimestamp(),
      })
      .eq("id", id)
      .eq("role", "mentor");

    throwIfSupabaseError(profileError);
  }

  if (mentor.active !== undefined) {
    const { error: mentorError } = await supabase
      .from("mentors")
      .update({ active: mentor.active })
      .eq("user_id", id);

    throwIfSupabaseError(mentorError);
  }

  return getMentor(id);
};

const deleteMentor = async (id: string) => {
  const supabase = createClient();
  const deletedAt = nowTimestamp();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ deleted_at: deletedAt })
    .eq("id", id)
    .eq("role", "mentor");

  throwIfSupabaseError(profileError);

  const { error: mentorError } = await supabase
    .from("mentors")
    .update({ deleted_at: deletedAt })
    .eq("user_id", id);

  throwIfSupabaseError(mentorError);
};

export {
  addMentor,
  deleteMentor,
  getMentor,
  getMentors,
  updateMentor,
};
