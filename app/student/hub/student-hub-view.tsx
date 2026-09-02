"use client";

import { useState } from "react";

import { useSessionCachedQuery } from "../../_lib/session-cache";
import { AccessError, LoadingState } from "../../components/auth-states";
import { StatePanel } from "../../components/state-panel";
import { useRequiredProfile } from "../../components/use-required-profile";
import {
  enrollStudentInCourses,
  getStudentEnrollmentState,
  type StudentEnrollmentState,
} from "../_data/enrollments";
import { getStudentHubState, type StudentHubState } from "../_data/hub";
import { StudentNavigation } from "../student-navigation";
import { CatchUpSection } from "./catch-up-section";
import { CourseSelectionPanel } from "./course-selection-panel";
import { NextLessonSection } from "./next-lesson-section";
import { PreferencesSection } from "./preferences-section";

export function StudentHubView() {
  const { user, profile, isLoading, error } = useRequiredProfile("student");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isSubmittingCourses, setIsSubmittingCourses] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const enrollmentStateQuery = useSessionCachedQuery<StudentEnrollmentState>({
    key: user ? `student:${user.id}:enrollment-state` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve({
          enrollments: [],
          availableCourses: [],
        });
      }

      return getStudentEnrollmentState(user.id);
    },
  });
  const hubStateQuery = useSessionCachedQuery<StudentHubState>({
    key: user ? `student:${user.id}:hub-state` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve({
          nextLesson: null,
          missedLessons: [],
        });
      }

      return getStudentHubState(user.id);
    },
  });
  const enrollments = enrollmentStateQuery.data?.enrollments ?? [];
  const availableCourses = enrollmentStateQuery.data?.availableCourses ?? [];
  const loadError =
    enrollmentError ??
    (enrollmentStateQuery.error
      ? "We could not load available courses right now."
      : null);

  async function handleEnrollInCourses() {
    if (!user || selectedCourseIds.length === 0) {
      return;
    }

    try {
      setIsSubmittingCourses(true);
      setEnrollmentError(null);

      const createdEnrollments = await enrollStudentInCourses(
        user.id,
        selectedCourseIds,
      );

      enrollmentStateQuery.setLocalData({
        enrollments: createdEnrollments,
        availableCourses: [],
      });
      hubStateQuery.setLocalData({
        nextLesson: null,
        missedLessons: [],
      });
      setSelectedCourseIds([]);
    } catch (submitError) {
      console.error(submitError);
      setEnrollmentError("We could not enroll you in those courses right now.");
    } finally {
      setIsSubmittingCourses(false);
    }
  }

  function toggleCourseSelection(courseId: string) {
    setSelectedCourseIds((currentIds) =>
      currentIds.includes(courseId)
        ? currentIds.filter((currentId) => currentId !== courseId)
        : [...currentIds, courseId],
    );
  }

  if (isLoading) {
    return <LoadingState title="Loading student hub" />;
  }

  if (error || !user || !profile) {
    return (
      <AccessError
        message={error ?? "We could not load your student profile."}
        loginHref="/student/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <StudentNavigation />

        <PreferencesSection />

        {hubStateQuery.isLoading ? (
          <StatePanel
            title="Loading schedule"
            text="Checking your upcoming lessons and catch up list."
          />
        ) : hubStateQuery.error ? (
          <StatePanel
            title="Schedule unavailable"
            text="We could not load your lesson schedule right now."
          />
        ) : (
          <>
            <NextLessonSection
              nextLesson={hubStateQuery.data?.nextLesson ?? null}
            />
            <CatchUpSection
              missedLessons={hubStateQuery.data?.missedLessons ?? []}
            />
          </>
        )}

        {enrollmentStateQuery.isLoading ? (
          <StatePanel
            title="Checking enrollments"
            text="Loading your course enrollment status."
          />
        ) : loadError ? (
          <StatePanel title="Course selection unavailable" text={loadError} />
        ) : enrollments.length === 0 ? (
          <CourseSelectionPanel
            courses={availableCourses}
            selectedCourseIds={selectedCourseIds}
            isSubmitting={isSubmittingCourses}
            onToggleCourse={toggleCourseSelection}
            onSubmit={handleEnrollInCourses}
          />
        ) : null}
      </section>
    </main>
  );
}
