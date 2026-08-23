"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import { formatDate, formatDateTime as formatTimestampDateTime } from "../_lib/dates";
import type { TimestampString } from "../_types/date";
import type { Mentor } from "../_types/mentor";
import type { Student } from "../_types/student";
import {
  createMentorAuthAndProfile,
  createStudentAuthAndProfile,
} from "./_data/account-actions";
import {
  getMentorGroupDetails,
  getStudentCourseDetails,
  type MentorGroupDetail,
  type StudentCourseDetail,
} from "./_data/person-details";
import { deleteMentor, getMentors } from "./_data/mentors";
import { deleteStudent, getStudents } from "./_data/students";

type ManagedRole = "student" | "mentor";

type ActionState = {
  type: "success" | "error";
  message: string;
} | null;

type SelectedPerson =
  | {
      role: "student";
      person: Student;
    }
  | {
      role: "mentor";
      person: Mentor;
    };

type DetailState = {
  key: string | null;
  isLoading: boolean;
  error: string | null;
  studentCourses: StudentCourseDetail[];
  mentorGroups: MentorGroupDetail[];
};

const emptyDetailState: DetailState = {
  key: null,
  isLoading: false,
  error: null,
  studentCourses: [],
  mentorGroups: [],
};

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
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson | null>(
    null,
  );
  const [detailState, setDetailState] =
    useState<DetailState>(emptyDetailState);

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

  useEffect(() => {
    if (!selectedPerson) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleCloseDetails();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPerson]);

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
        message: getSupabaseAccountMessage(createError, "student"),
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
        message: getSupabaseAccountMessage(createError, "mentor"),
      });
    } finally {
      setIsSubmitting(null);
    }
  }

  async function handleDeletePerson(role: ManagedRole, personId: string) {
    const confirmed = window.confirm(
      "Remove this profile from the portal? Access is soft-deleted in Supabase.",
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

  async function handleOpenDetails(selection: SelectedPerson) {
    const detailKey = `${selection.role}:${selection.person.id}`;

    setSelectedPerson(selection);
    setDetailState({
      ...emptyDetailState,
      key: detailKey,
      isLoading: true,
    });

    try {
      if (selection.role === "student") {
        const studentCourses = await getStudentCourseDetails(
          selection.person.id,
        );

        setDetailState((currentDetailState) =>
          currentDetailState.key === detailKey
            ? {
                ...emptyDetailState,
                key: detailKey,
                studentCourses,
              }
            : currentDetailState,
        );
      } else {
        const mentorGroups = await getMentorGroupDetails(selection.person.id);

        setDetailState((currentDetailState) =>
          currentDetailState.key === detailKey
            ? {
                ...emptyDetailState,
                key: detailKey,
                mentorGroups,
              }
            : currentDetailState,
        );
      }
    } catch (detailsError) {
      console.error(detailsError);
      setDetailState((currentDetailState) =>
        currentDetailState.key === detailKey
          ? {
              ...emptyDetailState,
              key: detailKey,
              error: "We could not load profile details right now.",
            }
          : currentDetailState,
      );
    }
  }

  function handleCloseDetails() {
    setSelectedPerson(null);
    setDetailState(emptyDetailState);
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
              role="student"
              title="Students"
              people={students}
              emptyText="No students found."
              pendingDeleteId={pendingDeleteId}
              onOpenDetails={(person) =>
                handleOpenDetails({ role: "student", person })
              }
              onDelete={(personId) => handleDeletePerson("student", personId)}
            />
            <PeopleList
              role="mentor"
              title="Mentors"
              people={mentors}
              emptyText="No mentors found."
              pendingDeleteId={pendingDeleteId}
              onOpenDetails={(person) =>
                handleOpenDetails({ role: "mentor", person })
              }
              onDelete={(personId) => handleDeletePerson("mentor", personId)}
            />
          </section>
        )}
      </section>
      {selectedPerson ? (
        <PersonDetailsModal
          selectedPerson={selectedPerson}
          detailState={detailState}
          mentors={mentors}
          onClose={handleCloseDetails}
        />
      ) : null}
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

function PeopleList<Person extends Student | Mentor>({
  role,
  title,
  people,
  emptyText,
  pendingDeleteId,
  onOpenDetails,
  onDelete,
}: {
  role: ManagedRole;
  title: string;
  people: Person[];
  emptyText: string;
  pendingDeleteId: string | null;
  onOpenDetails: (person: Person) => void;
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
              <button
                type="button"
                onClick={() => onOpenDetails(person)}
                className="-m-2 min-w-0 flex-1 rounded-sm p-2 text-left transition hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-forest/20"
                aria-label={`Open ${role} details for ${person.name} ${person.lastName}`}
              >
                <p className="font-semibold text-ink">
                  {person.name} {person.lastName}
                </p>
                <p className="mt-1 break-words text-sm text-ink-soft">
                  {person.email ?? "No email"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span className="break-all">ID: {person.id}</span>
                  {person.phone ? <span>Phone: {person.phone}</span> : null}
                  <span>Created: {formatDate(person.createdAt)}</span>
                  {"active" in person ? (
                    <span>{person.active ? "Active" : "Inactive"}</span>
                  ) : null}
                </div>
              </button>
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

function PersonDetailsModal({
  selectedPerson,
  detailState,
  mentors,
  onClose,
}: {
  selectedPerson: SelectedPerson;
  detailState: DetailState;
  mentors: Mentor[];
  onClose: () => void;
}) {
  const person = selectedPerson.person;
  const expectedDetailKey = `${selectedPerson.role}:${person.id}`;
  const isLoading =
    detailState.isLoading || detailState.key !== expectedDetailKey;
  const fullName = `${person.name} ${person.lastName}`;
  const roleLabel = selectedPerson.role === "student" ? "Student" : "Mentor";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-details-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-md border border-stone-200 bg-offwhite shadow-xl"
      >
        <header className="flex flex-col gap-4 border-b border-stone-200 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
              {roleLabel} details
            </p>
            <h2
              id="person-details-title"
              className="mt-2 break-words text-2xl font-semibold text-ink"
            >
              {fullName}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="break-all">ID: {person.id}</span>
              {person.email ? <span>{person.email}</span> : null}
              {person.phone ? <span>Phone: {person.phone}</span> : null}
              {"active" in person ? (
                <span>{person.active ? "Active" : "Inactive"}</span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-stone-200 px-4 py-2 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
          >
            Close
          </button>
        </header>

        <div className="overflow-y-auto p-5">
          {isLoading ? (
            <DetailStatePanel
              title="Loading details"
              text="Checking courses, groups, and attendance records."
            />
          ) : detailState.error ? (
            <DetailStatePanel title="Details unavailable" text={detailState.error} />
          ) : selectedPerson.role === "student" ? (
            <StudentDetails
              details={detailState.studentCourses}
              mentors={mentors}
            />
          ) : (
            <MentorDetails details={detailState.mentorGroups} />
          )}
        </div>
      </section>
    </div>
  );
}

function StudentDetails({
  details,
  mentors,
}: {
  details: StudentCourseDetail[];
  mentors: Mentor[];
}) {
  if (details.length === 0) {
    return (
      <DetailStatePanel
        title="No enrollments found"
        text="This student does not have connected course enrollments yet."
      />
    );
  }

  const attendedLessonCount = details.reduce(
    (total, detail) => total + detail.attendedLessons.length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric label="Courses" value={details.length} />
        <Metric label="Attended lessons" value={attendedLessonCount} />
      </div>

      {details.map((detail) => {
        const mentor = detail.enrollment.mentorId
          ? mentors.find(
              (nextMentor) => nextMentor.id === detail.enrollment.mentorId,
            )
          : null;

        return (
          <article
            key={detail.enrollment.id}
            className="rounded-sm border border-stone-200 bg-ivory-light p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-semibold text-ink">
                  {getCourseName(detail.course, detail.enrollment.courseId)}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Group:{" "}
                  {detail.enrollment.groupId
                    ? getGroupName(detail.group, detail.enrollment.groupId)
                    : "Your mentor will assign group soon."}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span>Status: {detail.enrollment.status}</span>
                  <span>Price: {detail.enrollment.price ?? "Not set"}</span>
                  <span>
                    Enrolled: {formatDateTime(detail.enrollment.enrolledAt)}
                  </span>
                  <span>
                    Mentor:{" "}
                    {mentor
                      ? `${mentor.name} ${mentor.lastName}`
                      : detail.enrollment.mentorId ?? "Not assigned"}
                  </span>
                </div>
              </div>
              <span className="rounded-sm bg-sage-100 px-3 py-1 text-sm font-bold text-forest">
                {detail.attendedLessons.length} attended
              </span>
            </div>

            {detail.attendedLessons.length === 0 ? (
              <p className="mt-4 rounded-sm border border-stone-200 bg-offwhite px-3 py-3 text-sm text-ink-soft">
                No attended lessons recorded for this course group.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {detail.attendedLessons.map(({ attendance, lesson }) => (
                  <div
                    key={attendance.id}
                    className="rounded-sm border border-stone-200 bg-offwhite px-3 py-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-ink">
                          {lesson?.title ?? `Lesson ID: ${attendance.lessonId}`}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          Lesson date:{" "}
                          {lesson
                            ? formatDateTime(lesson.date)
                            : "Lesson document not found"}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-success">
                        Attended {formatDateTime(attendance.attendedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function MentorDetails({ details }: { details: MentorGroupDetail[] }) {
  if (details.length === 0) {
    return (
      <DetailStatePanel
        title="No mentored groups found"
        text="This mentor does not have assigned course groups yet."
      />
    );
  }

  const courseCount = new Set(
    details.map((detail) => detail.course?.id ?? detail.group.courseId),
  ).size;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric label="Courses" value={courseCount} />
        <Metric label="Groups" value={details.length} />
      </div>

      <div className="space-y-3">
        {details.map((detail) => (
          <article
            key={`${detail.group.courseId}:${detail.group.id}`}
            className="rounded-sm border border-stone-200 bg-ivory-light p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-semibold text-ink">
                  {getCourseName(detail.course, detail.group.courseId)}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Group: {getGroupName(detail.group, detail.group.id)}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span className="break-all">Course ID: {detail.group.courseId}</span>
                  <span className="break-all">Group ID: {detail.group.id}</span>
                  <span>Created: {formatDate(detail.group.createdAt)}</span>
                </div>
              </div>
              <span
                className={`rounded-sm px-3 py-1 text-sm font-bold ${
                  detail.group.active
                    ? "bg-success/10 text-success"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {detail.group.active ? "Active group" : "Inactive group"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-ivory-light px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function DetailStatePanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-ivory-light p-4">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
    </div>
  );
}

function getCourseName(course: StudentCourseDetail["course"], courseId: string) {
  return course?.name ?? `Course ID: ${courseId}`;
}

function getGroupName(group: StudentCourseDetail["group"], groupId: string) {
  return group?.name ?? groupId;
}

function formatDateTime(timestamp: TimestampString) {
  return formatTimestampDateTime(timestamp);
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

function getSupabaseAccountMessage(error: unknown, role: ManagedRole) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (
      error.code === "email_exists" ||
      error.code === "user_already_exists" ||
      error.code === "auth/email-already-in-use"
    ) {
      return "An account with this email already exists.";
    }

    if (error.code === "auth/weak-password") {
      return "Use a stronger password.";
    }

    if (error.code === "auth/invalid-email") {
      return "Enter a valid email address.";
    }

    if (error.code === "auth/operation-not-allowed") {
      return "Email and password registration is not enabled for this Supabase project.";
    }

    if (error.code === "permission-denied") {
      return "This account does not have permission to manage portal profiles.";
    }
  }

  return `We could not create that ${role} account right now.`;
}
