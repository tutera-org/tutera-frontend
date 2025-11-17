"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../Reuse/Button";
import { useCourse, Module, Lesson, Quiz } from "./CourseContext";

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
  } = useCourse();
  const [showQuiz, setShowQuiz] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize modules from currentCourse or start with empty array
  // Use empty array initially to avoid hydration mismatch, then populate in useEffect
  const [modules, setModules] = useState<Module[]>([]);

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize modules after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (currentCourse?.modules && currentCourse.modules.length > 0) {
      setModules(currentCourse.modules);
    } else if (modules.length === 0) {
      // Only create initial module if we don't have any
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
    }
  }, []); // Only run once on mount

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

  const handleNext = () => {
    updateCurrentCourse({ modules });
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // Preview component
  if (showPreview) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="secondary"
              onClick={() => setShowPreview(false)}
              className="px-4 py-2"
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
                    <h3 className="text-xl font-semibold text-[#101A33] mb-3">
                      {module.name || `Module ${moduleIdx + 1}`}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#4977E6] text-white flex items-center justify-center text-sm font-semibold">
                            {lessonIdx + 1}
                          </div>
                          <span>
                            {lesson.name || `Lesson ${lessonIdx + 1}`}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center ml-auto">
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
              variant="secondary"
              onClick={() => setShowPreview(false)}
              className="px-6 py-2"
            >
              Back
            </Button>
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

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || modules.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Module and Lesson Form */}
      {!showQuiz && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border-2 border-dashed border-gray-300">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[#101A33] font-medium">
                  Module Name
                </label>
                {modules.length > 1 && (
                  <div className="flex gap-2">
                    {modules.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentModuleIndex(idx);
                          setCurrentLessonIndex(0);
                          setShowQuiz(false);
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          idx === currentModuleIndex
                            ? "bg-[#4977E6] text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Module {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={currentModule?.name || ""}
                onChange={(e) => handleModuleNameChange(e.target.value)}
                placeholder="Enter module name"
                className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-[#101A33] font-medium">
                  Lesson {currentLessonIndex + 1}
                </label>
                {currentModule.lessons.length > 1 && (
                  <div className="flex gap-2">
                    {currentModule.lessons.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentLessonIndex(idx)}
                        className={`px-3 py-1 rounded text-sm ${
                          idx === currentLessonIndex
                            ? "bg-[#4977E6] text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={currentLesson?.name || ""}
                  onChange={(e) => handleLessonNameChange(e.target.value)}
                  placeholder="Enter lesson name"
                  className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6] mb-4"
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
                  className="px-4 py-2 border-orange-500 text-orange-500"
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
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border-2 border-dashed border-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#101A33]">Quiz</h3>
            <Button
              variant="secondary"
              onClick={() => setShowQuiz(false)}
              className="px-4 py-2"
            >
              Back to Module
            </Button>
          </div>
          {currentModule.quizzes.length > 1 && (
            <div className="flex gap-2 mb-4">
              {currentModule.quizzes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuizIndex(idx)}
                  className={`px-3 py-1 rounded text-sm ${
                    idx === currentQuizIndex
                      ? "bg-[#4977E6] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Quiz {idx + 1}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-[#101A33] font-medium mb-2">
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
                className="px-4 py-2 border-orange-500 text-orange-500"
              >
                + Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="secondary" onClick={handleBack} className="px-6 py-2">
          Back
        </Button>
        <Button variant="primary" onClick={handleNext} className="px-6 py-2">
          Next
        </Button>
      </div>
    </div>
  );
}
