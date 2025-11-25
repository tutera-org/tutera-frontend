"use client";

import Button from "../Reuse/Button";
import MediaVideo from "../Reuse/MediaVideo";
import { Module } from "./CourseContext";

interface LessonPreviewProps {
  lesson: Module["lessons"][0];
  onBack: () => void;
}

export default function LessonPreview({ lesson, onBack }: LessonPreviewProps) {
  return (
    <div className="w-[80%] mx-auto">
      <div className="bg-white p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="secondary" onClick={onBack} className="px-4 py-2">
            ← Back to Course
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#101A33]">
            {lesson.name || "Lesson Title"}
          </h2>

          {(lesson.video || lesson.contentId) && (
            <div className="w-full">
              {lesson.videoFile?.type?.includes("pdf") ? (
                <iframe
                  src={lesson.video}
                  className="w-full h-96 rounded-lg"
                  title="PDF Document"
                />
              ) : (
                <MediaVideo
                  mediaId={lesson.contentId}
                  fallbackUrl={lesson.video}
                  className="w-full rounded-lg"
                  controls
                />
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


