"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isPaid: boolean;
  modules: any[];
  certificate: boolean;
  ratings: boolean;
  quizzes: any[];
  createdAt: string;
  status?: "draft" | "published"; // Add status field
}

interface CourseContextType {
  courses: Course[];
  currentCourse: Partial<Course> | null;
  currentStep: number;
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
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem("tutera_courses");
    const savedCurrentCourse = localStorage.getItem("tutera_current_course");
    const savedStep = localStorage.getItem("tutera_current_step");

    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses);
      setCourses(parsedCourses);
      
      // If no courses exist, reset step to 0
      if (parsedCourses.length === 0 && savedStep) {
        setCurrentStep(0);
        localStorage.removeItem("tutera_current_step");
      } else if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }
    } else if (savedStep) {
      // If no courses saved but step exists, reset it
      setCurrentStep(0);
      localStorage.removeItem("tutera_current_step");
    }
    
    if (savedCurrentCourse) {
      setCurrentCourse(JSON.parse(savedCurrentCourse));
    }
  }, []);

  // Reset step to 0 if courses array becomes empty AND we're not in creation flow
  useEffect(() => {
    // Don't reset if we're actively creating a course (steps 1-3)
    if (courses.length === 0 && currentStep > 3) {
      setCurrentStep(0);
      localStorage.removeItem("tutera_current_step");
    }
  }, [courses.length, currentStep]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("tutera_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    if (currentCourse) {
      localStorage.setItem("tutera_current_course", JSON.stringify(currentCourse));
    }
  }, [currentCourse]);

  useEffect(() => {
    localStorage.setItem("tutera_current_step", currentStep.toString());
  }, [currentStep]);

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

  const updateCourseStatus = (courseId: string, status: "draft" | "published") => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, status } : course
      )
    );
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const updateCurrentCourse = (data: Partial<Course>) => {
    setCurrentCourse((prev) => ({ ...prev, ...data }));
  };

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

