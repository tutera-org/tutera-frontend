"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../Reuse/Button";
import { useCourse, Module } from "./CourseContext";
import Image from "next/image";
import DeleteConfirmModal from "./DeleteConfirmModal";

// Helper function to generate unique IDs (only called client-side)
const generateId = (prefix: string) => {
  if (typeof window === "undefined") return `${prefix}-temp`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function Content() {
  const {
    updateCurrentCourse,
    setCurrentStep,
    currentCourse,
    showPreview,
    setShowPreview,
    showQuiz,
    setShowQuiz,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].video =
          reader.result as string;
        updatedModules[currentModuleIndex].lessons[
          currentLessonIndex
        ].videoFile = file;
        setModules(updatedModules);
        updateCurrentCourse({ modules: updatedModules });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].video =
          reader.result as string;
        updatedModules[currentModuleIndex].lessons[
          currentLessonIndex
        ].videoFile = file;
        setModules(updatedModules);
        updateCurrentCourse({ modules: updatedModules });
      };
      reader.readAsDataURL(file);
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

  // Lesson Preview component
  if (showPreview && selectedLesson !== null) {
    const lesson =
      modules[selectedLesson.moduleIndex]?.lessons[selectedLesson.lessonIndex];
    if (!lesson) {
      setSelectedLesson(null);
      return null;
    }

    return (
      <div className="w-full  mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="secondary"
              onClick={() => setSelectedLesson(null)}
              className="px-4 py-2"
            >
              ← Back to Course
            </Button>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#101A33]">
              {lesson.name || "Lesson Title"}
            </h2>

            {lesson.video && (
              <div className="w-full">
                {lesson.video.startsWith("data:video") ? (
                  <video
                    src={lesson.video}
                    controls
                    className="w-full rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : lesson.video.startsWith("data:application/pdf") ? (
                  <iframe
                    src={lesson.video}
                    className="w-full h-96 rounded-lg"
                    title="PDF Document"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Media Preview</span>
                  </div>
                )}
              </div>
            )}

            {lesson.description && (
              <div>
                <h3 className="text-xl font-semibold text-[#101A33] mb-3">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {lesson.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Course Preview component
  if (showPreview && selectedLesson === null) {
    return (
      <div className="w-full  mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="secondary"
              onClick={() => {
                setShowPreview(false);
                setSelectedLesson(null);
              }}
              className="px-4 py-2 border-none  text-[18px]"
            >
              ← Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#101A33] mb-4">
                {currentCourse?.title || "Course Title"}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentCourse?.description || "Course description"}
              </p>
              <p className="text-gray-500 mb-6">
                Learn at your own pace with structured modules and lessons
              </p>

              <div className="space-y-6">
                {modules.map((module, moduleIdx) => (
                  <div
                    key={module.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <h3 className="text-[24px] font-semibold text-[#101A33] mb-3">
                      {module.name || `Module ${moduleIdx + 1}`}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div
                          key={lesson.id}
                          onClick={() =>
                            setSelectedLesson({
                              moduleIndex: moduleIdx,
                              lessonIndex: lessonIdx,
                            })
                          }
                          className="flex items-center gap-3 text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#4977E6] text-white flex items-center justify-center text-sm font-semibold">
                            {lessonIdx + 1}
                          </div>
                          <span className="flex-1">
                            {lesson.name || `Lesson ${lessonIdx + 1}`}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Course Illustration</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="primary"
              onClick={handleNext}
              className="px-6 py-2"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
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
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  // Safety check: if no currentModule, show loading
  if (!currentModule || !currentModule.lessons) {
    return (
      <div className="w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto">
      {/* Module and Lesson Form */}
      {!showQuiz && (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 ">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[#101A33] font-semibold text-[24px]">
                  Module Name
                </label>
              </div>
              {modules.length > 1 && (
                <div className="flex gap-2 mb-4 justify-end">
                  {modules.map((_, idx) => (
                    <div
                      key={idx}
                      className="relative group"
                      draggable
                      onDragStart={(e) => handleModuleDragStart(e, idx)}
                      onDragOver={handleModuleDragOver}
                      onDrop={(e) => handleModuleDrop(e, idx)}
                    >
                      <button
                        onClick={() => {
                          setCurrentModuleIndex(idx);
                          setCurrentLessonIndex(0);
                          setShowQuiz(false);
                        }}
                        className={`px-3 py-1 rounded text-sm relative cursor-move ${
                          idx === currentModuleIndex
                            ? "bg-[#4977E6] text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Module {idx + 1}
                        {idx === currentModuleIndex && (
                          <div
                            className="absolute w-6 h-6 bg-gray-400  rounded-full -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(idx);
                            }}
                          >
                            <Image
                              src="/delete.svg"
                              alt="Delete"
                              width={23}
                              height={23}
                            />
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={currentModule?.name || ""}
                onChange={(e) => handleModuleNameChange(e.target.value)}
                placeholder="Enter module name"
                className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[#101A33] font-medium">
                  Lesson {currentLessonIndex + 1}
                </label>
              </div>
              {currentModule &&
                currentModule.lessons &&
                currentModule.lessons.length > 1 && (
                  <div className="flex gap-2 mb-3 justify-end">
                    {currentModule.lessons.map((_, idx) => (
                      <div
                        key={idx}
                        className="relative group"
                        draggable
                        onDragStart={(e) => handleLessonDragStart(e, idx)}
                        onDragOver={handleLessonDragOver}
                        onDrop={(e) => handleLessonDrop(e, idx)}
                      >
                        <button
                          onClick={() => setCurrentLessonIndex(idx)}
                          className={`px-3 py-1 rounded text-sm relative cursor-move ${
                            idx === currentLessonIndex
                              ? "bg-[#4977E6] text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {idx + 1}
                          {idx === currentLessonIndex && (
                            <div
                              className="absolute w-5 h-5 bg-gray-400  rounded-full -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLesson(idx);
                              }}
                            >
                              <Image
                                src="/delete.svg"
                                alt="Delete"
                                width={21}
                                height={21}
                              />
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              <div>
                <input
                  type="text"
                  value={currentLesson?.name || ""}
                  onChange={(e) => handleLessonNameChange(e.target.value)}
                  placeholder="Enter lesson name"
                  className="w-full px-4 py-2 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] mb-3"
                />
              </div>
              <div>
                <label className="block text-[#101A33] font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={currentLesson?.description || ""}
                  onChange={(e) =>
                    handleLessonDescriptionChange(e.target.value)
                  }
                  placeholder="Enter lesson description"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] resize-none"
                />
              </div>
              <div>
                <label className="block text-[#101A33] font-medium mb-2">
                  Video/File Upload
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 bg-[#F0F0F0] rounded-lg p-8 text-center cursor-pointer hover:border-[#5D5D5D] transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,.pdf,audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {currentLesson?.video ? (
                    <div className="text-green-600 font-medium">
                      File uploaded: {currentLesson.videoFile?.name || "Video"}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-yellow-500"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Drag and drop a video, pdf, audio here, or click to
                        select
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="secondary"
                onClick={handleAddLesson}
                className="px-4 py-2"
              >
                (+) Add lesson
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={handleAddQuiz}
                  className="px-4 py-2 border-[#DF4623] text-[#DF4623]"
                >
                  Add Quiz
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddModule}
                  className="px-4 py-2"
                >
                  Add Module
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Form */}
      {showQuiz && (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 ">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[24px] font-semibold text-[#101A33]">Quiz</h3>
            <Button
              variant="secondary"
              onClick={() => setShowQuiz(false)}
              className="px-4 py-2"
            >
              Back to Module
            </Button>
          </div>
          {currentModule &&
            currentModule.quizzes &&
            currentModule.quizzes.length > 1 && (
              <div className="flex gap-2 mb-6 justify-end">
                {currentModule.quizzes.map((_, idx) => (
                  <div
                    key={idx}
                    className="relative group"
                    draggable
                    onDragStart={(e) => handleQuizDragStart(e, idx)}
                    onDragOver={handleQuizDragOver}
                    onDrop={(e) => handleQuizDrop(e, idx)}
                  >
                    <button
                      onClick={() => setCurrentQuizIndex(idx)}
                      className={`px-3 py-1 rounded text-sm relative cursor-move ${
                        idx === currentQuizIndex
                          ? "bg-[#4977E6] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Quiz {idx + 1}
                      {idx === currentQuizIndex && (
                        <div
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuiz(idx);
                          }}
                        >
                          <Image
                            src="/delete.svg"
                            alt="Delete"
                            width={20}
                            height={20}
                          />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          <div className="space-y-4">
            <div>
              <label className="block text-[#101A33] text-[20px] font-semibold mb-2">
                Add question
              </label>
              <input
                type="text"
                value={currentQuiz?.question || ""}
                onChange={(e) => handleQuizQuestionChange(e.target.value)}
                placeholder="Type question here"
                className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
              />
            </div>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-[#4977E6] border-gray-300 rounded focus:ring-[#4977E6]"
                  />
                  <input
                    type="text"
                    value={currentQuiz?.options[index] || ""}
                    onChange={(e) =>
                      handleQuizOptionChange(index, e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                variant="secondary"
                onClick={handleAddNewQuiz}
                className="px-4 py-2 border-[#4977E6] text-[#4977E6]"
              >
                (+) Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="secondary" onClick={handleBack} className="px-6 py-2">
          Previous
        </Button>
        <Button variant="primary" onClick={handleNext} className="px-6 py-2">
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
