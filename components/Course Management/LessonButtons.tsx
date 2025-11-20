"use client";

import Image from "next/image";
import { DragHandleIcon } from "./utils";

interface LessonButtonsProps {
  lessons: unknown[];
  currentLessonIndex: number;
  onLessonClick: (index: number) => void;
  onDelete: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onTouchStart: (e: React.TouchEvent, index: number) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function LessonButtons({
  lessons,
  currentLessonIndex,
  onLessonClick,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onTouchStart,
  onTouchEnd,
}: LessonButtonsProps) {
  if (!lessons || lessons.length <= 1) return null;

  return (
    <div className="overflow-x-auto mb-3 md:mx-0 px-4 md:px-0 scroll-smooth scrollbar-hide">
      <div className="flex gap-2 justify-end min-w-max py-2">
        {lessons.map((_, idx) => (
          <div
            key={idx}
            className="relative group flex items-center gap-1 shrink-0"
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, idx)}
            onTouchStart={(e) => onTouchStart(e, idx)}
            onTouchEnd={onTouchEnd}
          >
            <button
              data-lesson-index={idx}
              onClick={() => onLessonClick(idx)}
              className={`px-3 py-1 rounded text-sm relative cursor-move flex items-center gap-1.5 ${
                idx === currentLessonIndex
                  ? "bg-[#4977E6] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <DragHandleIcon
                className={
                  idx === currentLessonIndex
                    ? "text-white opacity-70"
                    : "text-gray-500"
                }
              />
              {idx + 1}
            </button>
            {idx === currentLessonIndex && (
              <div
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer z-20 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idx);
                }}
              >
                <Image
                  src="/delete.svg"
                  alt="Delete"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


