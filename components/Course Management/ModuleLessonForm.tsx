"use client";

import Button from "../Reuse/Button";
import ModuleButtons from "./ModuleButtons";
import LessonButtons from "./LessonButtons";
import { Module } from "./CourseContext";

interface ModuleLessonFormProps {
  modules: Module[];
  currentModule: Module;
  currentModuleIndex: number;
  currentLessonIndex: number;
  currentLesson: Module["lessons"][0];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading?: boolean;
  onModuleNameChange: (value: string) => void;
  onLessonNameChange: (value: string) => void;
  onLessonDescriptionChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onAddLesson: () => void;
  onAddQuiz: () => void;
  onAddModule: () => void;
  onModuleClick: (index: number) => void;
  onLessonClick: (index: number) => void;
  onDeleteModule: (index: number) => void;
  onDeleteLesson: (index: number) => void;
  onModuleDragStart: (e: React.DragEvent, index: number) => void;
  onModuleDragOver: (e: React.DragEvent) => void;
  onModuleDrop: (e: React.DragEvent, index: number) => void;
  onModuleTouchStart: (e: React.TouchEvent, index: number) => void;
  onModuleTouchMove: (e: React.TouchEvent) => void;
  onModuleTouchEnd: (e: React.TouchEvent) => void;
  onLessonDragStart: (e: React.DragEvent, index: number) => void;
  onLessonDragOver: (e: React.DragEvent) => void;
  onLessonDrop: (e: React.DragEvent, index: number) => void;
  onLessonTouchStart: (e: React.TouchEvent, index: number) => void;
  onLessonTouchEnd: (e: React.TouchEvent) => void;
}

export default function ModuleLessonForm({
  modules,
  currentModule,
  currentModuleIndex,
  currentLessonIndex,
  currentLesson,
  fileInputRef,
  isUploading = false,
  onModuleNameChange,
  onLessonNameChange,
  onLessonDescriptionChange,
  onFileChange,
  onDragOver,
  onDrop,
  onAddLesson,
  onAddQuiz,
  onAddModule,
  onModuleClick,
  onLessonClick,
  onDeleteModule,
  onDeleteLesson,
  onModuleDragStart,
  onModuleDragOver,
  onModuleDrop,
  onModuleTouchStart,
  onModuleTouchMove,
  onModuleTouchEnd,
  onLessonDragStart,
  onLessonDragOver,
  onLessonDrop,
  onLessonTouchStart,
  onLessonTouchEnd,
}: ModuleLessonFormProps) {
  // Get file type for display message
  const getFileTypeMessage = () => {
    if (!currentLesson?.videoFile) return "Video uploaded successfully";
    const fileType = currentLesson.videoFile?.type;
    if (!fileType) return "File uploaded successfully";
    if (fileType.includes("pdf")) return "PDF uploaded successfully";
    if (fileType.includes("video")) return "Video uploaded successfully";
    if (fileType.includes("audio")) return "Audio uploaded successfully";
    return "File uploaded successfully";
  };
  return (
    <div className="w-full md:w-[80%] mx-auto md:rounded-lg md:px-6 md:py-4 md:border border-dashed border-[#101A33] bg-gray-50 px-4 py-6 rounded-2xl  md:bg-transparent">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-5">
            <label className="block text-[#101A33] font-semibold md:text-[24px] text-[18px]">
              Module Name
            </label>
          </div>
          <ModuleButtons
            modules={modules}
            currentModuleIndex={currentModuleIndex}
            onModuleClick={onModuleClick}
            onDelete={onDeleteModule}
            onDragStart={onModuleDragStart}
            onDragOver={onModuleDragOver}
            onDrop={onModuleDrop}
            onTouchStart={onModuleTouchStart}
            onTouchMove={onModuleTouchMove}
            onTouchEnd={onModuleTouchEnd}
          />
          <input
            type="text"
            value={currentModule?.name || ""}
            onChange={(e) => onModuleNameChange(e.target.value)}
            placeholder="Enter module name"
            className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus-ring-1 focus:ring-[#4977E6]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[#101A33] font-medium">
              Lesson {currentLessonIndex + 1}
            </label>
          </div>
          <LessonButtons
            lessons={currentModule?.lessons || []}
            currentLessonIndex={currentLessonIndex}
            onLessonClick={onLessonClick}
            onDelete={onDeleteLesson}
            onDragStart={onLessonDragStart}
            onDragOver={onLessonDragOver}
            onDrop={onLessonDrop}
            onTouchStart={onLessonTouchStart}
            onTouchEnd={onLessonTouchEnd}
          />
          <div>
            <input
              type="text"
              value={currentLesson?.name || ""}
              onChange={(e) => onLessonNameChange(e.target.value)}
              placeholder="Enter lesson name"
              className="w-full px-4 py-2 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus-ring-1 focus:ring-[#4977E6] mb-3"
            />
          </div>
          <div>
            <label className="block text-[#101A33] font-medium mb-2">
              Description
            </label>
            <textarea
              value={currentLesson?.description || ""}
              onChange={(e) => onLessonDescriptionChange(e.target.value)}
              placeholder="Enter lesson description"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus-ring-1 focus:ring-[#4977E6] resize-none"
            />
          </div>
          <div>
            <label className="block text-[#101A33] font-medium mb-2">
              Video/File Upload
            </label>
            <div
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 bg-[#F0F0F0] rounded-lg p-3 text-center cursor-pointer hover:border-[#5D5D5D] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.pdf,audio/*"
                onChange={onFileChange}
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4977E6] mb-2"></div>
                  <p className="text-gray-600">Uploading...</p>
                </div>
              ) : currentLesson?.video ? (
                <div className="text-green-600 font-medium">
                  ✓ {getFileTypeMessage()}
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
                    Drag and drop a video, pdf, audio here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">Up to 2GB</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={onAddLesson}
            className="px-4 py-2 border-none text-black md:text-[1rem] text-[14px] font-semibold bg-transparent"
          >
            <span className="text-[#0EB137]">(+)</span> Add Lesson
          </Button>

          <Button
            variant="secondary"
            onClick={onAddQuiz}
            className="px-5 py-2 border-none bg-transparent text-black md:text-[1rem] text-[14px] font-semibold"
          >
            <span className="text-[#DF4623]"> (+)</span> Add Quiz
          </Button>
        </div>

        <div className="flex justify-end items-center pt-4">
          <div className="flex gap-5">
            <Button
              variant="primary"
              onClick={onAddModule}
              className="px-5 py-2"
            >
              Add Module
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
