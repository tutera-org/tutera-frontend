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
  id: string; // Frontend ID
  _id?: string; // Backend ID - preserved for updates
  name: string;
  description: string;
  video?: string; // Signed URL for preview
  videoFile?: File;
  contentId?: string; // Media ID from backend
  order: number;
  type?: string; // Lesson type (VIDEO, PDF, etc.)
  duration?: number; // Lesson duration
  isPreview?: boolean; // Whether lesson is preview
}

export interface Quiz {
  id: string; // Frontend ID
  _id?: string; // Backend ID - preserved for updates
  question: string;
  options: string[];
  correctAnswer?: number; // Index of correct option
}

export interface Module {
  id: string; // Frontend ID
  _id?: string; // Backend ID - preserved for updates
  name: string;
  lessons: Lesson[];
  quizzes: Quiz[];
  order: number;
  quiz?: {
    _id?: string; // Backend quiz ID
    isPublished?: boolean;
    questions?: Array<{
      _id?: string;
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
    }>;
  };
}

export interface Course {
  id: string; // Frontend ID
  _id?: string; // Backend ID - preserved for updates
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
  deleteCourse: (courseId: string) => Promise<void>;
  updateCourseStatus: (courseId: string, status: "draft" | "published") => void;
  updateCurrentCourse: (data: Partial<Course>) => void;
  setCurrentStep: (step: number) => void;
  resetCurrentCourse: () => void;
  uploadMedia: (file: File) => Promise<{ mediaId: string; signedUrl: string }>;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (courseId: string) => Promise<Course>;
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

  // Fetch single course by ID with full details
  const fetchCourseById = useCallback(async (courseId: string): Promise<Course> => {
    try {
      console.log("📥 [FETCH COURSE BY ID] Fetching course:", courseId);
      const response = await fetch(`/api/v1/courses/${courseId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Course not found");
        }
        throw new Error(`Failed to fetch course: ${response.statusText}`);
      }

      const data = await response.json();
      const backendCourse = data.data || data;

      console.log("📥 [FETCH COURSE BY ID] Backend response:", backendCourse);

      // Transform backend course structure to match our Course interface
      interface BackendModule {
        _id?: string;
        id?: string;
        title?: string;
        name?: string;
        order?: number;
        lessons?: Array<{
          _id?: string;
          id?: string;
          title?: string;
          name?: string;
          description?: string;
          contentId?: string;
          video?: string;
          order?: number;
          type?: string;
        }>;
        quiz?: {
          _id?: string;
          isPublished?: boolean;
          questions?: Array<{
            _id?: string;
            questionText?: string;
            question?: string;
            options?: string[];
            correctAnswerIndex?: number;
            correctAnswer?: number;
          }>;
        };
        quizzes?: Array<{
          id?: string;
          question?: string;
          questionText?: string;
          options?: string[];
          correctAnswer?: number;
          correctAnswerIndex?: number;
        }>;
      }

      // Transform modules
      const transformedModules: Module[] = await Promise.all(
        (backendCourse.modules || []).map(async (module: BackendModule, moduleIndex: number) => {
          // Transform lessons
          const transformedLessons: Lesson[] = await Promise.all(
            (module.lessons || []).map(async (lesson: any, lessonIndex: number) => {
              // Extract contentId - handle both string and object formats
              let contentId = "";
              let videoUrl = lesson.video || "";
              
              if (lesson.contentId) {
                if (typeof lesson.contentId === "string") {
                  contentId = lesson.contentId;
                  // Fetch signed URL for video if we have contentId but no video URL
                  if (contentId && !videoUrl) {
                    try {
                      const mediaResponse = await fetch(`/api/v1/media/${contentId}`);
                      if (mediaResponse.ok) {
                        const mediaData = await mediaResponse.json();
                        videoUrl = mediaData.data?.signedUrl || "";
                      }
                    } catch (error) {
                      console.warn("Failed to fetch video URL for contentId:", contentId, error);
                    }
                  }
                } else if (typeof lesson.contentId === "object" && lesson.contentId._id) {
                  contentId = lesson.contentId._id;
                  // Fetch signed URL for video
                  if (contentId && !videoUrl) {
                    try {
                      const mediaResponse = await fetch(`/api/v1/media/${contentId}`);
                      if (mediaResponse.ok) {
                        const mediaData = await mediaResponse.json();
                        videoUrl = mediaData.data?.signedUrl || "";
                      }
                    } catch (error) {
                      console.warn("Failed to fetch video URL for contentId:", contentId, error);
                    }
                  }
                }
              }

              return {
                id: lesson._id || lesson.id || `lesson-${lessonIndex}`,
                _id: lesson._id || undefined, // Preserve backend ID
                name: lesson.title || lesson.name || "",
                description: lesson.description || "",
                video: videoUrl,
                contentId: contentId,
                order: lesson.order || lessonIndex + 1,
                type: lesson.type || "VIDEO",
                duration: lesson.duration || 0,
                isPreview: lesson.isPreview || false,
              };
            })
          );

          // Transform quiz - preserve quiz structure with _id
          const transformedQuizzes: Quiz[] = [];
          let quizData: Module["quiz"] | undefined = undefined;
          
          if (module.quiz) {
            // Preserve the quiz structure with _id
            quizData = {
              _id: module.quiz._id,
              isPublished: module.quiz.isPublished || true,
              questions: module.quiz.questions?.map((q: any) => ({
                _id: q._id,
                questionText: q.questionText || q.question || "",
                options: q.options || [],
                correctAnswerIndex: q.correctAnswerIndex ?? q.correctAnswer ?? 0,
              })),
            };
            
            // Also populate quizzes array for frontend use
            if (module.quiz.questions && module.quiz.questions.length > 0) {
              transformedQuizzes.push(
                ...module.quiz.questions.map((q: any) => ({
                  id: q._id || `quiz-${Date.now()}`,
                  _id: q._id || undefined,
                  question: q.questionText || q.question || "",
                  options: q.options || [],
                  correctAnswer: q.correctAnswerIndex ?? q.correctAnswer ?? 0,
                }))
              );
            }
          } else if (module.quizzes && module.quizzes.length > 0) {
            transformedQuizzes.push(
              ...module.quizzes.map((q: any) => ({
                id: q._id || q.id || `quiz-${Date.now()}`,
                _id: q._id || undefined,
                question: q.questionText || q.question || "",
                options: q.options || [],
                correctAnswer: q.correctAnswerIndex ?? q.correctAnswer ?? 0,
              }))
            );
          }

          return {
            id: module._id || module.id || `module-${moduleIndex}`,
            _id: module._id || undefined, // Preserve backend ID
            name: module.title || module.name || "",
            lessons: transformedLessons,
            quizzes: transformedQuizzes,
            order: module.order || moduleIndex + 1,
            quiz: quizData, // Preserve quiz structure with _id
          };
        })
      );

      // Build the transformed course
      const transformedCourse: Course = {
        id: backendCourse._id || backendCourse.id || courseId,
        _id: backendCourse._id || undefined, // Preserve backend ID
        title: backendCourse.title || "",
        description: backendCourse.description || "",
        thumbnail: "", // Will be handled by MediaImage component using thumbnailMediaId
        thumbnailMediaId: backendCourse.coverImage || null,
        price: backendCourse.price || 0,
        isPaid: (backendCourse.price || 0) > 0,
        modules: transformedModules,
        certificate: backendCourse.certificate || false,
        ratings: backendCourse.ratings || false,
        quizzes: [], // Global quizzes if any
        createdAt: backendCourse.createdAt || new Date().toISOString(),
        status:
          backendCourse.status?.toLowerCase() === "published" ||
          backendCourse.status === "ACTIVE" ||
          backendCourse.status === "PUBLISHED"
            ? "published"
            : "draft",
      };

      console.log("✅ [FETCH COURSE BY ID] Transformed course:", transformedCourse);

      return transformedCourse;
    } catch (error) {
      console.error("❌ [FETCH COURSE BY ID] Error:", error);
      throw error;
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
        status: "PUBLISHED" | "DRAFT" | "ACTIVE";
        modules: Array<{
          _id?: string; // Include _id for updates
          title: string;
          order: number;
          lessons: Array<{
            _id?: string; // Include _id for updates
            title: string;
            description: string;
            type: string;
            order: number;
            duration: number;
            isPreview: boolean;
            contentId: string;
          }>;
          quiz?: {
            _id?: string; // Include _id for updates
            isPublished: boolean;
            questions: Array<{
              _id?: string; // Include _id for updates
              questionText: string;
              options: string[];
              correctAnswerIndex: number;
            }>;
          };
        }>;
      }
      // Map status: "published" -> "PUBLISHED" or "ACTIVE", "draft" -> "DRAFT"
      let status: "PUBLISHED" | "DRAFT" | "ACTIVE" = "DRAFT";
      if (courseData.status === "published") {
        status = "PUBLISHED"; // or "ACTIVE" depending on backend preference
      }

      const coursePayload: CoursePayload = {
        title: courseData.title || "",
        description: courseData.description || "",
        price: courseData.price || 0,
        coverImage: coverImage,
        status: status,
        modules: modules.map((module, index) => {
          // Filter lessons that have contentId (can be string or object)
          const lessons = (module.lessons || []).filter(
            (lesson) => Boolean(lesson.name && lesson.contentId)
          );

          if (lessons.length === 0) {
            throw new Error(
              `Module "${
                module.name || `Module ${index + 1}`
              }" must have at least one lesson with a video`
            );
          }

          const modulePayload: {
            _id?: string;
            title: string;
            order: number;
            lessons: Array<{
              _id?: string;
              title: string;
              description: string;
              type: string;
              order: number;
              duration: number;
              isPreview: boolean;
              contentId: string;
            }>;
            quiz?: {
              _id?: string;
              isPublished: boolean;
              questions: Array<{
                _id?: string;
                questionText: string;
                options: string[];
                correctAnswerIndex: number;
              }>;
            };
          } = {
            // Include _id if it exists (for updates)
            ...(module._id && { _id: module._id }),
            title: module.name || "",
            order: module.order || index + 1,
            lessons: lessons.map((lesson, lessonIndex) => {
              // Ensure contentId is always a string (defensive check)
              let contentId = "";
              if (lesson.contentId) {
                if (typeof lesson.contentId === "string") {
                  contentId = lesson.contentId;
                } else if (typeof lesson.contentId === "object" && lesson.contentId !== null) {
                  // Type assertion for object with _id property
                  const contentIdObj = lesson.contentId as { _id?: string };
                  if (contentIdObj._id) {
                    contentId = contentIdObj._id;
                  }
                }
              }
              
              if (!contentId) {
                console.warn(`Lesson "${lesson.name}" has no valid contentId`);
              }

              const lessonPayload: {
                _id?: string;
                title: string;
                description: string;
                type: string;
                order: number;
                duration: number;
                isPreview: boolean;
                contentId: string;
              } = {
                // Include _id if it exists (for updates)
                ...(lesson._id && { _id: lesson._id }),
                title: lesson.name,
                description: lesson.description || "",
                type: lesson.type || "VIDEO",
                order: lesson.order || lessonIndex + 1,
                duration: lesson.duration || 0,
                isPreview: lesson.isPreview || false,
                contentId: contentId,
              };

              return lessonPayload;
            }),
          };

          // Include quiz if it exists - preserve _id structure
          if (module.quiz) {
            // Use the preserved quiz structure
            modulePayload.quiz = {
              ...(module.quiz._id && { _id: module.quiz._id }),
              isPublished: module.quiz.isPublished !== undefined ? module.quiz.isPublished : true,
              questions: (module.quiz.questions || []).map((q: any) => ({
                ...(q._id && { _id: q._id }),
                questionText: q.questionText || q.question || "",
                options: q.options || [],
                correctAnswerIndex: q.correctAnswerIndex ?? q.correctAnswer ?? 0,
              })),
            };
          } else if (module.quizzes && module.quizzes.length > 0) {
            // Fallback: use quizzes array if quiz object doesn't exist
            modulePayload.quiz = {
              isPublished: true,
              questions: module.quizzes.map((quiz) => ({
                ...(quiz._id && { _id: quiz._id }),
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
        "📤 [CREATE/UPDATE COURSE] Payload:",
        JSON.stringify(coursePayload, null, 2)
      );

      // Check if we're updating an existing course or creating a new one
      const isUpdate = courseData.id && courseData.id.trim() !== "";
      const courseId = courseData.id;

      let response: Response;
      if (isUpdate) {
        // Update existing course
        console.log("📝 [UPDATE COURSE] Updating course ID:", courseId);
        response = await fetch(`/api/v1/courses/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coursePayload),
        });
      } else {
        // Create new course
        console.log("➕ [CREATE COURSE] Creating new course");
        response = await fetch("/api/v1/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coursePayload),
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error(`❌ [${isUpdate ? "UPDATE" : "CREATE"} COURSE] Error response:`, errorData);
        throw new Error(
          errorData.error || `Failed to ${isUpdate ? "update" : "create"} course: ${response.statusText}`
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

  const updateCourseStatus = useCallback(
    async (courseId: string, status: "draft" | "published") => {
      // Find the course to get its current state (for rollback on error)
      const currentCourse = courses.find((c) => c.id === courseId);
      if (!currentCourse) {
        console.error("Course not found:", courseId);
        return;
      }

      const previousStatus = currentCourse.status;

      // Optimistic update: update local state immediately
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

      try {
        // Map frontend status to backend status
        const backendStatus: "DRAFT" | "PUBLISHED" =
          status === "published" ? "PUBLISHED" : "DRAFT";

        console.log(
          "📤 [UPDATE COURSE STATUS] Updating course:",
          courseId,
          "to",
          backendStatus
        );

        // Call API to update status
        const response = await fetch(`/api/v1/courses/${courseId}/publish`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: backendStatus }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(
            errorData.error || `Failed to update course status: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("✅ [UPDATE COURSE STATUS] Success:", data);

        // Refresh courses list to ensure consistency with backend
        await fetchCourses();
      } catch (error) {
        console.error("❌ [UPDATE COURSE STATUS] Error:", error);

        // Rollback: revert to previous status on error
        setCourses((prev) => {
          const updated = prev.map((course) =>
            course.id === courseId
              ? { ...course, status: previousStatus || "draft" }
              : course
          );
          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("tutera_courses", JSON.stringify(updated));
          }
          return updated;
        });

        // Re-throw error so caller can show toast
        throw error;
      }
    },
    [courses, fetchCourses]
  );

  const deleteCourse = useCallback(async (courseId: string) => {
    console.log("🗑️ [DELETE COURSE] Starting deletion for courseId:", courseId);
    
    try {
      // Call API to delete course
      const response = await fetch(`/api/v1/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("❌ [DELETE COURSE] Error response:", errorData);
        throw new Error(
          errorData.error || `Failed to delete course: ${response.statusText}`
        );
      }

      console.log("✅ [DELETE COURSE] Course deleted successfully");

      // Remove from state after successful API call
      setCourses((prev) => {
        const updated = prev.filter((c) => c.id !== courseId);
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

      // Refresh courses list to ensure consistency
      await fetchCourses();
    } catch (error) {
      console.error("❌ [DELETE COURSE] Error:", error);
      throw error; // Re-throw to let caller handle (e.g., show toast)
    }
  }, [fetchCourses]);

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
        fetchCourseById,
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
