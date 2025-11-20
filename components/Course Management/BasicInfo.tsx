"use client";

import { useState, useRef, useEffect, startTransition } from "react";
import Button from "../Reuse/Button";
import { useCourse } from "./CourseContext";
import Image from "next/image";

export default function BasicInfo() {
  const { updateCurrentCourse, setCurrentStep, currentCourse } = useCourse();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasLoadedRef = useRef(false);

  // Load existing course data when component mounts or currentCourse changes
  useEffect(() => {
    // Use startTransition to batch state updates and avoid cascading renders
    startTransition(() => {
      if (currentCourse) {
        // Always load data when currentCourse changes (for editing)
        setTitle(currentCourse.title ?? "");
        setDescription(currentCourse.description ?? "");
        setThumbnail(currentCourse.thumbnail ?? "");
        hasLoadedRef.current = true;
      } else {
        // Reset when no currentCourse
        setTitle("");
        setDescription("");
        setThumbnail("");
        hasLoadedRef.current = false;
      }
    });
  }, [currentCourse]);

  // Auto-save title and description as user types
  useEffect(() => {
    if (hasLoadedRef.current) {
      const timeoutId = setTimeout(() => {
        updateCurrentCourse({
          title,
          description,
          thumbnail: thumbnail || "",
        });
      }, 300); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [title, description, thumbnail, updateCurrentCourse]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (PNG, JPG)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const thumbnailData = reader.result as string;
        setThumbnail(thumbnailData);
        updateCurrentCourse({ thumbnail: thumbnailData });
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
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (PNG, JPG)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const thumbnailData = reader.result as string;
        setThumbnail(thumbnailData);
        updateCurrentCourse({ thumbnail: thumbnailData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!title.trim()) {
      alert("Please enter a course title");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a course description");
      return;
    }
    updateCurrentCourse({
      title,
      description,
      thumbnail: thumbnail || "",
    });
    setCurrentStep(2);
  };

  return (
    <div>
    <div className="w-full md:w-[80%] md:rounded-lg md:px-6 md:py-4 md:border border-dashed border-[#101a33c6] mx-auto">
      <div className=" rounded-[16px]  py-2 md:mb-4">
        <span className="text-[#101A33] md:text-[24px] text-[16px] font-semibold">Info</span>
      </div>
      <div className="bg-white rounded-[16px] text-[20px]shadow-lg py-4 md:py-4">
        <div className="space-y-5">
          <div>
            <label className="block text-[#101A33] font-semibold md:text-[1.25rem] text-[1rem] mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g Complete Web Development Bootcamp"
              className="w-full px-4 py-3 border-2 border-gray-300  placeholder:text-[#5D5D5D] rounded-lg focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-[#101A33] font-semibold md:text-[1.25rem] text-[1rem] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what student will learn, who this course is for, and what makes it unique..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-300  placeholder:text-[#5D5D5D] rounded-lg focus:outline-none resize-none h-[100px] overflow-y-auto scrollbar-smooth"
            />
          </div>

          <div>
            <label className="block text-[#101A33] font-semibold md:text-[1.25rem] text-[1rem] mb-2">
              Course Cover
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 bg-[#F0F0F0] placeholder:text-[#5D5D5D] rounded-lg p-8 text-center cursor-pointer hover:border-[#5D5D5D] transition-colors  "
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              {thumbnail ? (
                <div className="relative w-full h-45 rounded-lg overflow-hidden ">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
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
                      className="text-gray-400"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  <button
                    type="button"
                    className="mt-4 text-[#4977E6] font-medium flex items-center gap-2 mx-auto"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Choose file
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
    <div className=" flex md:justify-end justify-center gap-4 md:w-[80%] w-full mx-auto  mt-6">
         
          <Button variant="primary" onClick={handleNext} className="w-full  md:w-[20%] py-3">
            Next
          </Button>
        </div>
    </div>
  );
}
