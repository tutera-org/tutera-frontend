"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../Reuse/Button";
import { useCourse, Module } from "./CourseContext";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { generateId } from "./utils";
import LessonPreview from "./LessonPreview";
import CoursePreview from "./CoursePreview";
import ModuleLessonForm from "./ModuleLessonForm";
import QuizForm from "./QuizForm";

export default function Content() {
  const {
    updateCurrentCourse,
    setCurrentStep,
    currentCourse,
    showPreview,
    setShowPreview,
    showQuiz,
    setShowQuiz,
    uploadMedia,
  } = useCourse();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "module" | "lesson" | "quiz";
    index: number;
    name: string;
  }>({
    isOpen: false,
    type: "module",
    index: 0,
    name: "",
  });
  const [selectedLesson, setSelectedLesson] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);

  // Initialize modules from currentCourse or start with empty array
  // Use empty array initially to avoid hydration mismatch, then populate in useEffect
  const [modules, setModules] = useState<Module[]>(() => {
    if (typeof window === "undefined") return [];
    // Try to load from currentCourse on initial render
    return [];
  });

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [uploadingVideoIndex, setUploadingVideoIndex] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitializedRef = useRef(false);
  const lastCourseIdRef = useRef<string | undefined>(undefined);

  // Initialize modules after mount to avoid hydration mismatch
  // Reset and reload when course ID changes (for editing)
  useEffect(() => {
    const currentCourseId = currentCourse?.id;

    // Reset initialization flag when course ID changes (for editing)
    if (currentCourseId !== lastCourseIdRef.current) {
      hasInitializedRef.current = false;
      lastCourseIdRef.current = currentCourseId;
    }

    // Skip if already initialized for this course
    if (hasInitializedRef.current) return;

    if (currentCourse?.modules && currentCourse.modules.length > 0) {
      // Load modules from currentCourse
      setModules(currentCourse.modules);
      hasInitializedRef.current = true;
    } else if (currentCourse?.id) {
      // Course exists (editing) but has no modules - create initial module
      setModules([
        {
          id: generateId("module"),
          name: "",
          lessons: [
            {
              id: generateId("lesson"),
              name: "",
              description: "",
              order: 1,
            },
          ],
          quizzes: [],
          order: 1,
        },
      ]);
      hasInitializedRef.current = true;
    } else if (!currentCourse || !currentCourse.id) {
      // New course creation - create initial module
      if (modules.length === 0) {
        setModules([
          {
            id: generateId("module"),
            name: "",
            lessons: [
              {
                id: generateId("lesson"),
                name: "",
                description: "",
                order: 1,
              },
            ],
            quizzes: [],
            order: 1,
          },
        ]);
        hasInitializedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourse?.id, currentCourse?.modules]);

  const currentModule = modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];
  const currentQuiz = currentModule?.quizzes[currentQuizIndex];

  const handleModuleNameChange = (value: string) => {
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].name = value;
    setModules(updatedModules);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleLessonNameChange = (value: string) => {
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].lessons[currentLessonIndex].name = value;
    setModules(updatedModules);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleLessonDescriptionChange = (value: string) => {
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].lessons[currentLessonIndex].description =
      value;
    setModules(updatedModules);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      setUploadingVideoIndex({ moduleIndex: currentModuleIndex, lessonIndex: currentLessonIndex });
      try {
        const { mediaId, signedUrl } = await uploadMedia(file);
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].video = signedUrl;
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].contentId = mediaId;
        setModules(updatedModules);
        updateCurrentCourse({ modules: updatedModules });
      } catch (error) {
        console.error("Error uploading video:", error);
        alert(error instanceof Error ? error.message : "Failed to upload video");
      } finally {
        setUploadingVideoIndex(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      setUploadingVideoIndex({ moduleIndex: currentModuleIndex, lessonIndex: currentLessonIndex });
      try {
        const { mediaId, signedUrl } = await uploadMedia(file);
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].video = signedUrl;
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].contentId = mediaId;
        setModules(updatedModules);
        updateCurrentCourse({ modules: updatedModules });
      } catch (error) {
        console.error("Error uploading video:", error);
        alert(error instanceof Error ? error.message : "Failed to upload video");
      } finally {
        setUploadingVideoIndex(null);
      }
    }
  };

  const handleAddLesson = () => {
    const updatedModules = [...modules];
    const newLessonNumber =
      updatedModules[currentModuleIndex].lessons.length + 1;
    updatedModules[currentModuleIndex].lessons.push({
      id: generateId("lesson"),
      name: "",
      description: "",
      order: newLessonNumber,
    });
    setModules(updatedModules);
    setCurrentLessonIndex(newLessonNumber - 1);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleAddModule = () => {
    const updatedModules = [...modules];
    const newModuleNumber = updatedModules.length + 1;
    updatedModules.push({
      id: generateId("module"),
      name: "",
      lessons: [
        {
          id: generateId("lesson"),
          name: "",
          description: "",
          order: 1,
        },
      ],
      quizzes: [],
      order: newModuleNumber,
    });
    setModules(updatedModules);
    setCurrentModuleIndex(newModuleNumber - 1);
    setCurrentLessonIndex(0);
    setShowQuiz(false);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleAddQuiz = () => {
    setShowQuiz(true);
    const updatedModules = [...modules];
    if (!updatedModules[currentModuleIndex].quizzes.length) {
      updatedModules[currentModuleIndex].quizzes.push({
        id: generateId("quiz"),
        question: "",
        options: ["", "", "", ""],
      });
      setModules(updatedModules);
      setCurrentQuizIndex(0);
      updateCurrentCourse({ modules: updatedModules });
    }
  };

  const handleQuizQuestionChange = (value: string) => {
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].quizzes[currentQuizIndex].question =
      value;
    setModules(updatedModules);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleQuizOptionChange = (optionIndex: number, value: string) => {
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].quizzes[currentQuizIndex].options[
      optionIndex
    ] = value;
    setModules(updatedModules);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleAddNewQuiz = () => {
    const updatedModules = [...modules];
    const newQuiz = {
      id: generateId("quiz"),
      question: "",
      options: ["", "", "", ""],
    };
    updatedModules[currentModuleIndex].quizzes.push(newQuiz);
    setModules(updatedModules);
    setCurrentQuizIndex(updatedModules[currentModuleIndex].quizzes.length - 1);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleDeleteModule = (moduleIndex: number) => {
    if (modules.length === 1) {
      alert("You must have at least one module");
      return;
    }
    setDeleteModal({
      isOpen: true,
      type: "module",
      index: moduleIndex,
      name: `Module ${moduleIndex + 1}`,
    });
  };

  const handleDeleteLesson = (lessonIndex: number) => {
    if (
      currentModule &&
      currentModule.lessons &&
      currentModule.lessons.length === 1
    ) {
      alert("You must have at least one lesson");
      return;
    }
    setDeleteModal({
      isOpen: true,
      type: "lesson",
      index: lessonIndex,
      name: `Lesson ${lessonIndex + 1}`,
    });
  };

  const handleDeleteQuiz = (quizIndex: number) => {
    setDeleteModal({
      isOpen: true,
      type: "quiz",
      index: quizIndex,
      name: `Quiz ${quizIndex + 1}`,
    });
  };

  const confirmDelete = () => {
    if (deleteModal.type === "module") {
      const updatedModules = modules.filter(
        (_, idx) => idx !== deleteModal.index
      );
      setModules(updatedModules);
      if (currentModuleIndex >= updatedModules.length) {
        setCurrentModuleIndex(updatedModules.length - 1);
      }
      setCurrentLessonIndex(0);
      updateCurrentCourse({ modules: updatedModules });
    } else if (deleteModal.type === "lesson") {
      const updatedModules = [...modules];
      updatedModules[currentModuleIndex].lessons = updatedModules[
        currentModuleIndex
      ].lessons.filter((_, idx) => idx !== deleteModal.index);
      setModules(updatedModules);
      if (
        currentLessonIndex >= updatedModules[currentModuleIndex].lessons.length
      ) {
        setCurrentLessonIndex(
          updatedModules[currentModuleIndex].lessons.length - 1
        );
      }
      updateCurrentCourse({ modules: updatedModules });
    } else if (deleteModal.type === "quiz") {
      const updatedModules = [...modules];
      updatedModules[currentModuleIndex].quizzes = updatedModules[
        currentModuleIndex
      ].quizzes.filter((_, idx) => idx !== deleteModal.index);
      setModules(updatedModules);
      if (updatedModules[currentModuleIndex].quizzes.length === 0) {
        setShowQuiz(false);
      } else if (
        currentQuizIndex >= updatedModules[currentModuleIndex].quizzes.length
      ) {
        setCurrentQuizIndex(
          updatedModules[currentModuleIndex].quizzes.length - 1
        );
      }
      updateCurrentCourse({ modules: updatedModules });
    }
  };

  const [draggedModuleIndex, setDraggedModuleIndex] = useState<number | null>(
    null
  );
  const [draggedLessonIndex, setDraggedLessonIndex] = useState<number | null>(
    null
  );
  const [draggedQuizIndex, setDraggedQuizIndex] = useState<number | null>(null);

  // Touch drag state for mobile
  const [touchDragState, setTouchDragState] = useState<{
    type: "module" | "lesson" | "quiz" | null;
    index: number;
    startX: number;
    startY: number;
  } | null>(null);

  const handleModuleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedModuleIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleModuleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleModuleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedModuleIndex === null || draggedModuleIndex === dropIndex) {
      setDraggedModuleIndex(null);
      return;
    }
    const updatedModules = [...modules];
    const [movedModule] = updatedModules.splice(draggedModuleIndex, 1);
    updatedModules.splice(dropIndex, 0, movedModule);
    updatedModules.forEach((module, idx) => {
      module.order = idx + 1;
    });
    setModules(updatedModules);
    setCurrentModuleIndex(dropIndex);
    setDraggedModuleIndex(null);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleLessonDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLessonIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleLessonDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedLessonIndex === null || draggedLessonIndex === dropIndex) {
      setDraggedLessonIndex(null);
      return;
    }
    const updatedModules = [...modules];
    const lessons = [...updatedModules[currentModuleIndex].lessons];
    const [movedLesson] = lessons.splice(draggedLessonIndex, 1);
    lessons.splice(dropIndex, 0, movedLesson);
    lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    updatedModules[currentModuleIndex].lessons = lessons;
    setModules(updatedModules);
    setCurrentLessonIndex(dropIndex);
    setDraggedLessonIndex(null);
    updateCurrentCourse({ modules: updatedModules });
  };

  const handleQuizDragStart = (e: React.DragEvent, index: number) => {
    setDraggedQuizIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleQuizDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleQuizDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedQuizIndex === null || draggedQuizIndex === dropIndex) {
      setDraggedQuizIndex(null);
      return;
    }
    const updatedModules = [...modules];
    const quizzes = [...updatedModules[currentModuleIndex].quizzes];
    const [movedQuiz] = quizzes.splice(draggedQuizIndex, 1);
    quizzes.splice(dropIndex, 0, movedQuiz);
    updatedModules[currentModuleIndex].quizzes = quizzes;
    setModules(updatedModules);
    setCurrentQuizIndex(dropIndex);
    setDraggedQuizIndex(null);
    updateCurrentCourse({ modules: updatedModules });
  };

  // Touch-based drag handlers for mobile
  const handleModuleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchDragState({
      type: "module",
      index,
      startX: touch.clientX,
      startY: touch.clientY,
    });
    setDraggedModuleIndex(index);
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const handleModuleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragState || touchDragState.type !== "module") return;
    e.preventDefault();
  };

  const handleModuleTouchEnd = (e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!touchDragState || touchDragState.type !== "module") {
      target.style.opacity = "1";
      return;
    }

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // Find the module button element
    const moduleButton = element?.closest("[data-module-index]");
    if (moduleButton) {
      const dropIndex = parseInt(
        moduleButton.getAttribute("data-module-index") || "0"
      );

      if (draggedModuleIndex !== null && draggedModuleIndex !== dropIndex) {
        const updatedModules = [...modules];
        const [movedModule] = updatedModules.splice(draggedModuleIndex, 1);
        updatedModules.splice(dropIndex, 0, movedModule);
        updatedModules.forEach((module, idx) => {
          module.order = idx + 1;
        });
        setModules(updatedModules);
        setCurrentModuleIndex(dropIndex);
        updateCurrentCourse({ modules: updatedModules });
      }
    }

    setTouchDragState(null);
    setDraggedModuleIndex(null);
    target.style.opacity = "1";
  };

  const handleLessonTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchDragState({
      type: "lesson",
      index,
      startX: touch.clientX,
      startY: touch.clientY,
    });
    setDraggedLessonIndex(index);
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const handleLessonTouchEnd = (e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!touchDragState || touchDragState.type !== "lesson") {
      target.style.opacity = "1";
      return;
    }

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    const lessonButton = element?.closest("[data-lesson-index]");
    if (lessonButton) {
      const dropIndex = parseInt(
        lessonButton.getAttribute("data-lesson-index") || "0"
      );

      if (draggedLessonIndex !== null && draggedLessonIndex !== dropIndex) {
        const updatedModules = [...modules];
        const lessons = [...updatedModules[currentModuleIndex].lessons];
        const [movedLesson] = lessons.splice(draggedLessonIndex, 1);
        lessons.splice(dropIndex, 0, movedLesson);
        lessons.forEach((lesson, idx) => {
          lesson.order = idx + 1;
        });
        updatedModules[currentModuleIndex].lessons = lessons;
        setModules(updatedModules);
        setCurrentLessonIndex(dropIndex);
        updateCurrentCourse({ modules: updatedModules });
      }
    }

    setTouchDragState(null);
    setDraggedLessonIndex(null);
    target.style.opacity = "1";
  };

  const handleQuizTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchDragState({
      type: "quiz",
      index,
      startX: touch.clientX,
      startY: touch.clientY,
    });
    setDraggedQuizIndex(index);
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const handleQuizTouchEnd = (e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!touchDragState || touchDragState.type !== "quiz") {
      target.style.opacity = "1";
      return;
    }

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    const quizButton = element?.closest("[data-quiz-index]");
    if (quizButton) {
      const dropIndex = parseInt(
        quizButton.getAttribute("data-quiz-index") || "0"
      );

      if (draggedQuizIndex !== null && draggedQuizIndex !== dropIndex) {
        const updatedModules = [...modules];
        const quizzes = [...updatedModules[currentModuleIndex].quizzes];
        const [movedQuiz] = quizzes.splice(draggedQuizIndex, 1);
        quizzes.splice(dropIndex, 0, movedQuiz);
        updatedModules[currentModuleIndex].quizzes = quizzes;
        setModules(updatedModules);
        setCurrentQuizIndex(dropIndex);
        updateCurrentCourse({ modules: updatedModules });
      }
    }

    setTouchDragState(null);
    setDraggedQuizIndex(null);
    target.style.opacity = "1";
  };

  const handleNext = () => {
    updateCurrentCourse({ modules });
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // Reset selectedLesson when preview is closed
  useEffect(() => {
    if (!showPreview) {
      setSelectedLesson(null);
    }
  }, [showPreview]);

  // Close preview when quiz is opened
  useEffect(() => {
    if (showQuiz && showPreview) {
      setShowPreview(false);
      setSelectedLesson(null);
    }
  }, [showQuiz, showPreview, setShowPreview]);

  // Lesson Preview component
  if (showPreview && !showQuiz && selectedLesson !== null) {
    const lesson =
      modules[selectedLesson.moduleIndex]?.lessons[selectedLesson.lessonIndex];
    if (!lesson) {
      setSelectedLesson(null);
      return null;
    }

    return (
      <LessonPreview lesson={lesson} onBack={() => setSelectedLesson(null)} />
    );
  }

  // Course Preview component
  if (showPreview && !showQuiz && selectedLesson === null) {
    return (
      <CoursePreview
        courseTitle={currentCourse?.title}
        courseDescription={currentCourse?.description}
        courseThumbnail={currentCourse?.thumbnail}
        modules={modules}
        onBack={() => {
          setShowPreview(false);
          setSelectedLesson(null);
        }}
        onNext={handleNext}
        onLessonClick={(moduleIndex, lessonIndex) =>
          setSelectedLesson({ moduleIndex, lessonIndex })
        }
      />
    );
  }

  // Don't render until initialized to avoid hydration mismatch
  // But allow rendering if we have modules or if we're in edit mode with a course ID
  if (
    modules.length === 0 &&
    !hasInitializedRef.current &&
    !currentCourse?.id
  ) {
    return (
      <div className="w-full max-w-[1240px] mx-auto">
        <div className=" w-full">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  // Safety check: if no currentModule, show loading
  if (!currentModule || !currentModule.lessons) {
    return (
      <div className="w-full mx-auto">
        <div className="bg-white  p-6 md:p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto">
      {/* Module and Lesson Form */}
      {!showQuiz && (
        <ModuleLessonForm
          modules={modules}
          currentModule={currentModule}
          currentModuleIndex={currentModuleIndex}
          currentLessonIndex={currentLessonIndex}
          currentLesson={currentLesson}
          fileInputRef={fileInputRef}
          onModuleNameChange={handleModuleNameChange}
          onLessonNameChange={handleLessonNameChange}
          onLessonDescriptionChange={handleLessonDescriptionChange}
          onFileChange={handleFileChange}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onAddLesson={handleAddLesson}
          onAddQuiz={handleAddQuiz}
          onAddModule={handleAddModule}
          onModuleClick={(idx) => {
            setCurrentModuleIndex(idx);
            setCurrentLessonIndex(0);
            setShowQuiz(false);
          }}
          onLessonClick={setCurrentLessonIndex}
          onDeleteModule={handleDeleteModule}
          onDeleteLesson={handleDeleteLesson}
          onModuleDragStart={handleModuleDragStart}
          onModuleDragOver={handleModuleDragOver}
          onModuleDrop={handleModuleDrop}
          onModuleTouchStart={handleModuleTouchStart}
          onModuleTouchMove={handleModuleTouchMove}
          onModuleTouchEnd={handleModuleTouchEnd}
          onLessonDragStart={handleLessonDragStart}
          onLessonDragOver={handleLessonDragOver}
          onLessonDrop={handleLessonDrop}
          onLessonTouchStart={handleLessonTouchStart}
          onLessonTouchEnd={handleLessonTouchEnd}
        />
      )}

      {/* Quiz Form */}
      {showQuiz && (
        <QuizForm
          currentQuiz={currentQuiz}
          quizzes={currentModule?.quizzes || []}
          currentQuizIndex={currentQuizIndex}
          onBack={() => setShowQuiz(false)}
          onQuizClick={setCurrentQuizIndex}
          onDelete={handleDeleteQuiz}
          onQuestionChange={handleQuizQuestionChange}
          onOptionChange={handleQuizOptionChange}
          onAddNewQuiz={handleAddNewQuiz}
          onDragStart={handleQuizDragStart}
          onDragOver={handleQuizDragOver}
          onDrop={handleQuizDrop}
          onTouchStart={handleQuizTouchStart}
          onTouchEnd={handleQuizTouchEnd}
        />
      )}

      {/* Navigation Buttons */}
      <div className=" flex md:justify-end justify-center gap-4 w-[80%] mx-auto mt-8">
        {!showQuiz && (
          <Button
            variant="secondary"
            onClick={handleBack}
            className="px-10 py-2"
          >
            Previous
          </Button>
        )}
        <Button variant="primary" onClick={handleNext} className="px-13 py-2">
          Next
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, type: "module", index: 0, name: "" })
        }
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.name}?`}
        message={`Are you sure you want to delete ${deleteModal.name}? This action cannot be undone.`}
      />
    </div>
  );
}
