"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Lesson {
  id: string;
  name: string;
  description: string;
  video?: string; // File URL or base64
  videoFile?: File;
  order: number;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number; // Index of correct option
}

export interface Module {
  id: string;
  name: string;
  lessons: Lesson[];
  quizzes: Quiz[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isPaid: boolean;
  modules: Module[];
  certificate: boolean;
  ratings: boolean;
  quizzes: Quiz[];
  createdAt: string;
  status?: "draft" | "published";
}

interface CourseContextType {
  courses: Course[];
  currentCourse: Partial<Course> | null;
  currentStep: number;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  addCourse: (course: Course, keepStep?: boolean) => void;
  deleteCourse: (courseId: string) => void;
  updateCourseStatus: (courseId: string, status: "draft" | "published") => void;
  updateCurrentCourse: (data: Partial<Course>) => void;
  setCurrentStep: (step: number) => void;
  resetCurrentCourse: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCourses = localStorage.getItem("tutera_courses");
    const savedCurrentCourse = localStorage.getItem("tutera_current_course");
    const savedStep = localStorage.getItem("tutera_current_step");

    // Load saved courses
    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        setCourses(parsedCourses);
      } catch (error) {
        console.error("Error parsing saved courses:", error);
      }
    }

    // Restore step first (before loading currentCourse)
    if (savedStep) {
      const step = parseInt(savedStep);
      // Only restore step if it's between 1-3 (valid creation steps)
      if (step >= 1 && step <= 3) {
        setCurrentStep(step);
        
        // If we're restoring a step but no currentCourse exists, initialize it
        // This handles the case where user refreshed before entering any data
        if (!savedCurrentCourse) {
          setCurrentCourse({});
        }
      }
    }

    // Load saved current course (this is the course being created/edited)
    if (savedCurrentCourse) {
      try {
        const parsedCurrentCourse = JSON.parse(savedCurrentCourse);
        setCurrentCourse(parsedCurrentCourse);
      } catch (error) {
        console.error("Error parsing saved current course:", error);
      }
    }

    setIsHydrated(true);
  }, []);

  // Reset step to 0 if courses array becomes empty AND we're not in creation flow
  useEffect(() => {
    // Don't reset if we're actively creating a course (steps 1-3) or have a currentCourse
    if (courses.length === 0 && currentStep > 3 && !currentCourse) {
      setCurrentStep(0);
      localStorage.removeItem("tutera_current_step");
    }
  }, [courses.length, currentStep, currentCourse]);

  // Save to localStorage whenever state changes (client-side only)
  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    localStorage.setItem("tutera_courses", JSON.stringify(courses));
  }, [courses, isHydrated]);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    if (currentCourse) {
      localStorage.setItem(
        "tutera_current_course",
        JSON.stringify(currentCourse)
      );
    }
  }, [currentCourse, isHydrated]);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    localStorage.setItem("tutera_current_step", currentStep.toString());
  }, [currentStep, isHydrated]);

  const addCourse = (course: Course, keepStep: boolean = false) => {
    // Set default status to "draft" if not provided
    const courseWithStatus = { ...course, status: course.status || "draft" };
    setCourses((prev) => [...prev, courseWithStatus]);
    setCurrentCourse(null);
    if (!keepStep) {
      setCurrentStep(0);
    }
    localStorage.removeItem("tutera_current_course");
  };

  const updateCourseStatus = (
    courseId: string,
    status: "draft" | "published"
  ) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, status } : course
      )
    );
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    // Clean up localStorage if courses become empty
    if (typeof window !== "undefined") {
      const updatedCourses = courses.filter((c) => c.id !== courseId);
      if (updatedCourses.length === 0) {
        localStorage.removeItem("tutera_courses");
      }
    }
  };

  const updateCurrentCourse = useCallback((data: Partial<Course>) => {
    setCurrentCourse((prev) => ({ ...prev, ...data }));
  }, []);

  const resetCurrentCourse = () => {
    setCurrentCourse(null);
    setCurrentStep(0);
    localStorage.removeItem("tutera_current_course");
    localStorage.removeItem("tutera_current_step");
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        currentCourse,
        currentStep,
        showPreview,
        setShowPreview,
        addCourse,
        deleteCourse,
        updateCourseStatus,
        updateCurrentCourse,
        setCurrentStep,
        resetCurrentCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
}
