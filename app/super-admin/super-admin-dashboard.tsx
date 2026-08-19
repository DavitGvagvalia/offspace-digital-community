"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import { formatFirebaseDate } from "../_lib/firebase/firestore-utils";
import type { Mentor } from "../_types/mentor";
import type { Student } from "../_types/student";
import {
  createMentorAuthAndProfile,
  deleteMentor,
  getMentors,
} from "./_data/mentors";
import {
  createStudentAuthAndProfile,
  deleteStudent,
  getStudents,
} from "./_data/students";

type ManagedRole = "student" | "mentor";

type ActionState = {
  type: "success" | "error";
  message: string;
} | null;

export function SuperAdminDashboard() {
  const { profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("super-admin");
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<ManagedRole | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPeople() {
      if (!profile) {
        return;
      }

      try {
        setIsLoadingPeople(true);
        setLoadError(null);

        const [nextStudents, nextMentors] = await Promise.all([
          getStudents(),
          getMentors(),
        ]);

        if (isMounted) {
          setStudents(sortStudents(nextStudents));
          setMentors(sortMentors(nextMentors));
        }
      } catch (peopleError) {
        console.error(peopleError);

        if (isMounted) {
          setLoadError("We could not load students and mentors right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPeople(false);
        }
      }
    }

    loadPeople();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  const adminName = useMemo(() => {
    if (!profile?.name && !profile?.lastName) {
      return "Super-admin";
    }

    return [profile.name, profile.lastName].filter(Boolean).join(" ");
  }, [profile]);

  async function handleCreateStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = readPersonForm(formData);

    try {
      setIsSubmitting("student");
      setActionState(null);

      const result = await createStudentAuthAndProfile(input);

      setStudents((currentStudents) =>
        sortStudents([...currentStudents, result.student]),
      );
      setActionState({
        type: "success",
        message: `Created student account for ${result.email}.`,
      });
      form.reset();
    } catch (createError) {
      console.error(createError);
      setActionState({
        type: "error",
        message: getFirebaseAccountMessage(createError, "student"),
      });
    } finally {
      setIsSubmitting(null);
    }
  }

  async function handleCreateMentor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = {
      ...readPersonForm(formData),
      active: formData.get("active") === "on",
    };

    try {
      setIsSubmitting("mentor");
      setActionState(null);

      const result = await createMentorAuthAndProfile(input);

      setMentors((currentMentors) =>
        sortMentors([...currentMentors, result.mentor]),
      );
      setActionState({
        type: "success",
        message: `Created mentor account for ${result.email}.`,
      });
      form.reset();
    } catch (createError) {
      console.error(createError);
      setActionState({
        type: "error",
        message: getFirebaseAccountMessage(createError, "mentor"),
      });
    } finally {
      setIsSubmitting(null);
    }
  }

  async function handleDeletePerson(role: ManagedRole, personId: string) {
    const confirmed = window.confirm(
      "Remove this profile from the portal? The Firebase Auth account will remain until it is deleted from a trusted admin backend.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingDeleteId(personId);
      setActionState(null);

      if (role === "student") {
        await deleteStudent(personId);
        setStudents((currentStudents) =>
          currentStudents.filter((student) => student.id !== personId),
        );
      } else {
        await deleteMentor(personId);
        setMentors((currentMentors) =>
          currentMentors.filter((mentor) => mentor.id !== personId),
        );
      }

      setActionState({
        type: "success",
        message: "Removed portal profile access.",
      });
    } catch (deleteError) {
      console.error(deleteError);
      setActionState({
        type: "error",
        message: "We could not remove that profile right now.",
      });
    } finally {
      setPendingDeleteId(null);
    }
  }

  if (isAuthLoading) {
    return <LoadingState title="Loading super-admin portal" />;
  }

  if (authError || !profile) {
    return (
      <AccessError
        message={authError ?? "We could not load your super-admin profile."}
        loginHref="/super-admin/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Super-admin portal
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            {adminName}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
            Manage student and mentor profile access for the schedule and
            attendance app.
          </p>
        </header>

        {actionState ? (
          <p
            className={`rounded-sm border px-3 py-2 text-sm ${
              actionState.type === "success"
                ? "border-success/20 bg-success/10 text-success"
                : "border-danger/20 bg-danger/10 text-danger"
            }`}
          >
            {actionState.message}
          </p>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-2">
          <PersonForm
            role="student"
            isSubmitting={isSubmitting === "student"}
            onSubmit={handleCreateStudent}
          />
          <PersonForm
            role="mentor"
            isSubmitting={isSubmitting === "mentor"}
            onSubmit={handleCreateMentor}
          />
        </section>

        {isLoadingPeople ? (
          <StatePanel title="Loading people" text="Checking portal profiles." />
        ) : loadError ? (
          <StatePanel title="Profiles unavailable" text={loadError} />
        ) : (
          <section className="grid gap-5 lg:grid-cols-2">
            <PeopleList
              title="Students"
              people={students}
              emptyText="No students found."
              pendingDeleteId={pendingDeleteId}
              onDelete={(personId) => handleDeletePerson("student", personId)}
            />
            <PeopleList
              title="Mentors"
              people={mentors}
              emptyText="No mentors found."
              pendingDeleteId={pendingDeleteId}
              onDelete={(personId) => handleDeletePerson("mentor", personId)}
            />
          </section>
        )}
      </section>
    </main>
  );
}

function PersonForm({
  role,
  isSubmitting,
  onSubmit,
}: {
  role: ManagedRole;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const label = role === "student" ? "Student" : "Mentor";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
          Add {role}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          New {role} account
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="given-name"
            className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink">Last name</span>
          <input
            type="text"
            name="lastName"
            required
            autoComplete="family-name"
            className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">{label} email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">Phone</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </label>

      {role === "mentor" ? (
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            className="h-4 w-4 rounded border-stone-300 text-forest focus:ring-forest"
          />
          Active mentor
        </label>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? `Creating ${role}...` : `Create ${role}`}
      </button>
    </form>
  );
}

function PeopleList({
  title,
  people,
  emptyText,
  pendingDeleteId,
  onDelete,
}: {
  title: string;
  people: Array<Student | Mentor>;
  emptyText: string;
  pendingDeleteId: string | null;
  onDelete: (personId: string) => void;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Directory
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
        </div>
        <span className="rounded-sm bg-sage-100 px-3 py-1 text-sm font-bold text-forest">
          {people.length}
        </span>
      </div>

      {people.length === 0 ? (
        <p className="mt-5 rounded-sm border border-stone-200 bg-ivory-light px-3 py-3 text-sm text-ink-soft">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-stone-200">
          {people.map((person) => (
            <li
              key={person.id}
              className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">
                  {person.name} {person.lastName}
                </p>
                <p className="mt-1 break-words text-sm text-ink-soft">
                  {person.email ?? "No email"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span className="break-all">ID: {person.id}</span>
                  {person.phone ? <span>Phone: {person.phone}</span> : null}
                  <span>Created: {formatFirebaseDate(person.createdAt)}</span>
                  {"active" in person ? (
                    <span>{person.active ? "Active" : "Inactive"}</span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                disabled={pendingDeleteId === person.id}
                onClick={() => onDelete(person.id)}
                className="w-full rounded-sm border border-danger/30 px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {pendingDeleteId === person.id ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function readPersonForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  return {
    name,
    lastName,
    email,
    password,
    ...(phone ? { phone } : {}),
  };
}

function sortStudents(students: Student[]) {
  return [...students].sort(comparePeople);
}

function sortMentors(mentors: Mentor[]) {
  return [...mentors].sort(comparePeople);
}

function comparePeople(
  first: Pick<Student | Mentor, "name" | "lastName">,
  second: Pick<Student | Mentor, "name" | "lastName">,
) {
  return `${first.lastName} ${first.name}`.localeCompare(
    `${second.lastName} ${second.name}`,
  );
}

function getFirebaseAccountMessage(error: unknown, role: ManagedRole) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (error.code === "auth/email-already-in-use") {
      return "An account with this email already exists.";
    }

    if (error.code === "auth/weak-password") {
      return "Use a stronger password.";
    }

    if (error.code === "auth/invalid-email") {
      return "Enter a valid email address.";
    }

    if (error.code === "auth/operation-not-allowed") {
      return "Email and password registration is not enabled for this Firebase project.";
    }

    if (error.code === "permission-denied") {
      return "This account does not have permission to manage portal profiles.";
    }
  }

  return `We could not create that ${role} account right now.`;
}
