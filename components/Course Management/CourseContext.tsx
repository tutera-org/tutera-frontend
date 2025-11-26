"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Use relative URLs for API calls - Next.js API routes work on all subdomains
// The proxy middleware ignores /api/ routes (see proxy.ts), so they're accessible on tenant subdomains
// This avoids CORS issues when trying to cross-origin fetch

export interface Lesson {
  id: string;
  name: string;
  description: string;
  video?: string; // Signed URL for preview
  videoFile?: File;
  contentId?: string; // Media ID from backend
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
  thumbnail: string; // Signed URL for preview
  thumbnailMediaId?: string; // Media ID for course creation
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
  showQuiz: boolean;
  setShowQuiz: (show: boolean) => void;
  addCourse: (course: Course, keepStep?: boolean) => void;
  deleteCourse: (courseId: string) => void;
  updateCourseStatus: (courseId: string, status: "draft" | "published") => void;
  updateCurrentCourse: (data: Partial<Course>) => void;
  setCurrentStep: (step: number) => void;
  resetCurrentCourse: () => void;
  uploadMedia: (file: File) => Promise<{ mediaId: string; signedUrl: string }>;
  fetchCourses: () => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Upload media file and get mediaId + signedUrl
  const uploadMedia = useCallback(
    async (file: File): Promise<{ mediaId: string; signedUrl: string }> => {
      const formData = new FormData();
      formData.append("file", file);

      // Use relative URL - Next.js API routes work on all subdomains
      const response = await fetch("/api/v1/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload media");
      }

      const data = await response.json();
      // Backend may return either 'mediaId' or '_id' - handle both
      const mediaId = data.data?.mediaId || data.data?._id;
      if (!mediaId) {
        throw new Error("No media ID returned from upload");
      }
      return {
        mediaId: mediaId,
        signedUrl: data.data.signedUrl,
      };
    },
    []
  );

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      // Use relative URL - works on all subdomains (proxy ignores /api/ routes)
      const response = await fetch("/api/v1/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();

      // Backend returns { data: [...] }
      const coursesArray = data.data || [];

      // Transform backend courses to match our Course interface
      interface BackendCourse {
        _id?: string;
        id?: string;
        title?: string;
        description?: string;
        coverImage?: string;
        price?: number;
        modules?: unknown[];
        certificate?: boolean;
        ratings?: boolean;
        quizzes?: unknown[];
        createdAt?: string;
        status?: string;
      }
      const transformedCourses = coursesArray.map((course: BackendCourse) => ({
        id: course._id || course.id || "",
        title: course.title || "",
        description: course.description || "",
        thumbnail: "", // Don't store URL here - it expires. Use thumbnailMediaId instead
        thumbnailMediaId: course.coverImage || null, // Backend returns mediaId in coverImage
        price: course.price || 0,
        isPaid: (course.price || 0) > 0,
        modules: course.modules || [],
        certificate: course.certificate || false,
        ratings: course.ratings || false,
        quizzes: course.quizzes || [],
        createdAt: course.createdAt || new Date().toISOString(),
        status:
          course.status?.toLowerCase() === "published" ? "published" : "draft",
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Create course via API
  const createCourse = useCallback(
    async (courseData: Partial<Course>) => {
      // Use thumbnailMediaId if available
      const coverImage = courseData.thumbnailMediaId || "";

      if (!coverImage) {
        throw new Error("Course cover image is required");
      }

      const modules = courseData.modules || [];

      if (modules.length === 0) {
        throw new Error("At least one module is required");
      }

      // Build course payload matching backend structure
      interface CoursePayload {
        title: string;
        description: string;
        price: number;
        coverImage: string;
        status: "PUBLISHED" | "DRAFT";
        modules: Array<{
          title: string;
          order: number;
          lessons: Array<{
            title: string;
            description: string;
            type: string;
            order: number;
            duration: number;
            isPreview: boolean;
            contentId: string;
          }>;
          quiz?: {
            isPublished: boolean;
            questions: Array<{
              questionText: string;
              options: string[];
              correctAnswerIndex: number;
            }>;
          };
        }>;
      }
      const coursePayload: CoursePayload = {
        title: courseData.title || "",
        description: courseData.description || "",
        price: courseData.price || 0,
        coverImage: coverImage,
        status: courseData.status === "published" ? "PUBLISHED" : "DRAFT",
        modules: modules.map((module, index) => {
          const lessons = (module.lessons || []).filter(
            (lesson): lesson is Lesson & { contentId: string } =>
              Boolean(lesson.name && lesson.contentId)
          );

          if (lessons.length === 0) {
            throw new Error(
              `Module "${
                module.name || `Module ${index + 1}`
              }" must have at least one lesson with a video`
            );
          }

          const modulePayload: {
            title: string;
            order: number;
            lessons: Array<{
              title: string;
              description: string;
              type: string;
              order: number;
              duration: number;
              isPreview: boolean;
              contentId: string;
            }>;
            quiz?: {
              isPublished: boolean;
              questions: Array<{
                questionText: string;
                options: string[];
                correctAnswerIndex: number;
              }>;
            };
          } = {
            title: module.name || "",
            order: module.order || index + 1,
            lessons: lessons.map((lesson, lessonIndex) => ({
              title: lesson.name,
              description: lesson.description || "",
              type: "VIDEO",
              order: lesson.order || lessonIndex + 1,
              duration: 0,
              isPreview: false,
              contentId: lesson.contentId,
            })),
          };

          // Only include quiz if it exists and has questions
          if (module.quizzes && module.quizzes.length > 0) {
            modulePayload.quiz = {
              isPublished: true,
              questions: module.quizzes.map((quiz) => ({
                questionText: quiz.question,
                options: quiz.options || [],
                correctAnswerIndex: quiz.correctAnswer || 0,
              })),
            };
          }

          return modulePayload;
        }),
      };

      console.log(
        "📤 [CREATE COURSE] Payload:",
        JSON.stringify(coursePayload, null, 2)
      );

      // Use relative URL - works on all subdomains (proxy ignores /api/ routes)
      const response = await fetch("/api/v1/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coursePayload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("❌ [CREATE COURSE] Error response:", errorData);
        throw new Error(
          errorData.error || `Failed to create course: ${response.statusText}`
        );
      }

      const data = await response.json();
      await fetchCourses(); // Refresh courses list
      return data;
    },
    [fetchCourses]
  );

  // Fetch courses from API on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchCourses();
  }, [fetchCourses]);

  // Load from localStorage on mount (client-side only) - for currentCourse only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCurrentCourse = localStorage.getItem("tutera_current_course");
    const savedStep = localStorage.getItem("tutera_current_step");

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

  // Don't save courses to localStorage anymore - they come from API

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
    // Dispatch custom event for ConditionalNavbar to react immediately
    window.dispatchEvent(new CustomEvent("tutera-step-changed"));
  }, [currentStep, isHydrated]);

  const addCourse = (course: Course, keepStep: boolean = false) => {
    // Set default status to "draft" if not provided
    const courseWithStatus = { ...course, status: course.status || "draft" };
    setCourses((prev) => {
      // Check if course already exists (for editing)
      const existingIndex = prev.findIndex((c) => c.id === course.id);
      let updated;
      if (existingIndex >= 0) {
        // Update existing course
        updated = [...prev];
        updated[existingIndex] = courseWithStatus;
      } else {
        // Add new course
        updated = [...prev, courseWithStatus];
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tutera_courses", JSON.stringify(updated));
      }
      return updated;
    });
    // Only clear currentCourse if we're not keeping the step (i.e., going back to course list)
    if (!keepStep) {
      setCurrentCourse(null);
      setCurrentStep(0);
      localStorage.removeItem("tutera_current_course");
    }
  };

  const updateCourseStatus = (
    courseId: string,
    status: "draft" | "published"
  ) => {
    setCourses((prev) => {
      const updated = prev.map((course) =>
        course.id === courseId ? { ...course, status } : course
      );
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tutera_courses", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteCourse = useCallback((courseId: string) => {
    console.log("deleteCourse called with courseId:", courseId);
    
    // Delete from state - the useEffect will handle saving to localStorage
    setCourses((prev) => {
      console.log(
        "setCourses prev length:",
        prev.length,
        "courseIds:",
        prev.map((c) => c.id)
      );
      const updated = prev.filter((c) => c.id !== courseId);
      console.log(
        "setCourses updated length:",
        updated.length,
        "courseIds:",
        updated.map((c) => c.id)
      );
      return updated;
    });
    
    // If the deleted course is the current course being edited, clear it
    setCurrentCourse((prev) => {
      if (prev?.id === courseId) {
        setCurrentStep(0);
        if (typeof window !== "undefined") {
          localStorage.removeItem("tutera_current_course");
          localStorage.removeItem("tutera_current_step");
        }
        return null;
      }
      return prev;
    });
  }, []);

  const updateCurrentCourse = useCallback((data: Partial<Course>) => {
    setCurrentCourse((prev) => {
      const updated = { ...prev, ...data };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tutera_current_course", JSON.stringify(updated));
      }
      return updated;
    });
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
        showQuiz,
        setShowQuiz,
        addCourse,
        deleteCourse,
        updateCourseStatus,
        updateCurrentCourse,
        setCurrentStep,
        resetCurrentCourse,
        uploadMedia,
        fetchCourses,
        createCourse,
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
