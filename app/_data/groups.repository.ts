import { nowTimestamp } from "../_lib/dates";
import { createClient } from "../_lib/supabase/client";
import { mapGroup } from "../_lib/supabase/mappers";
import type { CreateGroup } from "../_types/group";
import { requireSupabaseData, throwIfSupabaseError } from "./supabase-errors";

const getGroups = async (courseId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("course_id", courseId)
    .is("deleted_at", null)
    .order("created_at");

  throwIfSupabaseError(error);

  return (data ?? []).map(mapGroup);
};

const getGroup = async (courseId: string, id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("course_id", courseId)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data ? mapGroup(data) : null;
};

const addGroup = async (group: CreateGroup) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .insert({
      course_id: group.courseId,
      mentor_id: group.mentorId,
      name: group.name ?? null,
      active: group.active,
    })
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapGroup(requireSupabaseData(data));
};

const updateGroup = async (
  courseId: string,
  id: string,
  group: Partial<CreateGroup>,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .update({
      ...(group.courseId !== undefined ? { course_id: group.courseId } : {}),
      ...(group.mentorId !== undefined ? { mentor_id: group.mentorId } : {}),
      ...(group.name !== undefined ? { name: group.name } : {}),
      ...(group.active !== undefined ? { active: group.active } : {}),
      updated_at: nowTimestamp(),
    })
    .eq("course_id", courseId)
    .eq("id", id)
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapGroup(requireSupabaseData(data));
};

const deleteGroup = async (courseId: string, id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("groups")
    .update({ deleted_at: nowTimestamp() })
    .eq("course_id", courseId)
    .eq("id", id);

  throwIfSupabaseError(error);
};

export { addGroup, deleteGroup, getGroup, getGroups, updateGroup };
