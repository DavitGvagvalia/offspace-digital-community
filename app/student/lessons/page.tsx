"use client";

import { useState, useEffect } from "react";
import { getPrivateStudent } from "../../services/courses.services";
import { formatFirebaseDate } from "../../services/utils";
function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);

  const getLessons = async (courseId: string, studentId: string) => {
    const privateStudent = await getPrivateStudent(courseId, studentId);

    const lessons = privateStudent?.lessons ?? [];

    setLessons(lessons);
  };

  useEffect(() => {
    getLessons(
      "j8WNaTj5rfNNUgUOYjSL",
      "rQl31kkEd7fp7l40muVQVM5wSUk2"
    );
  }, []);

  return (
    <main className="min-h-screen p-5 bg-offwhite flex flex-col justify-center items-center">
      <h1>Lessons</h1>

      {lessons.map((lesson, index) => {
        console.log(lesson);
        const date = formatFirebaseDate(lesson.date);
        return (
          <div key={index}>
            <p>{date}</p>
          </div>
        );

      })}
    </main>
  );
}

export default LessonsPage;