"use client";

import Image from "next/image";
import { DragHandleIcon } from "./utils";

interface ModuleButtonsProps {
  modules: unknown[];
  currentModuleIndex: number;
  onModuleClick: (index: number) => void;
  onDelete: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onTouchStart: (e: React.TouchEvent, index: number) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function ModuleButtons({
  modules,
  currentModuleIndex,
  onModuleClick,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: ModuleButtonsProps) {
  if (modules.length <= 1) return null;

  return (
    <div className="overflow-x-auto mb-4 md:mx-0 px-4 md:px-0 scroll-smooth scrollbar-hide">
      <div className="flex gap-2 justify-end min-w-max py-2">
        {modules.map((_, idx) => (
          <div
            key={idx}
            className="relative group flex items-center gap-1 shrink-0"
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, idx)}
            onTouchStart={(e) => onTouchStart(e, idx)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              data-module-index={idx}
              onClick={() => onModuleClick(idx)}
              className={`px-3 py-1 rounded text-[10px] md:text-sm relative cursor-move flex items-center gap-1.5 ${
                idx === currentModuleIndex
                  ? "bg-[#4977E6] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <DragHandleIcon
                className={
                  idx === currentModuleIndex
                    ? "text-white opacity-70"
                    : "text-gray-500"
                }
              />
              Module {idx + 1}
            </button>
            {idx === currentModuleIndex && (
              <div
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer z-20 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idx);
                }}
              >
                <Image
                  src="/delete.svg"
                  alt="Delete"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


