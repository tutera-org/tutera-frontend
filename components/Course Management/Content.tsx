"use client";

import { useState } from "react";
import Button from "../Reuse/Button";
import { useCourse } from "./CourseContext";

export default function Content() {
  const { updateCurrentCourse, setCurrentStep, currentCourse } = useCourse();
  const [options, setOptions] = useState({
    modules: currentCourse?.modules !== undefined,
    certificate: currentCourse?.certificate || false,
    ratings: currentCourse?.ratings || false,
    payment: currentCourse?.isPaid !== undefined,
    quizzes: currentCourse?.quizzes !== undefined,
  });

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleModulesClick = () => {
    // Open file picker for videos and resources
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "video/*,.pdf,.doc,.docx";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files).map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }));
        updateCurrentCourse({ modules: fileArray });
        setOptions((prev) => ({ ...prev, modules: true }));
      }
    };
    input.click();
  };

  const handlePaymentClick = () => {
    setOptions((prev) => ({ ...prev, payment: true }));
    updateCurrentCourse({ isPaid: true });
  };

  const handleQuizClick = () => {
    // Will show quiz form later - for now just mark as enabled
    setOptions((prev) => ({ ...prev, quizzes: true }));
    updateCurrentCourse({ quizzes: [] });
  };

  const handleNext = () => {
    updateCurrentCourse({
      certificate: options.certificate,
      ratings: options.ratings,
      isPaid: options.payment,
    });
    setCurrentStep(3);
  };

  const contentOptions = [
    {
      key: "modules" as const,
      title: "Add Modules & Lessons",
      description: "Structure your course with organized modules, video lessons, and resources",
      onClick: handleModulesClick,
    },
    {
      key: "certificate" as const,
      title: "Enable Certificate",
      description: "Award students a completion certificate when they finish the course",
      onClick: () => handleOptionChange("certificate"),
    },
    {
      key: "ratings" as const,
      title: "Allow Student Ratings",
      description: "Let students rate and review your course to build credibility",
      onClick: () => handleOptionChange("ratings"),
    },
    {
      key: "payment" as const,
      title: "Add Payment",
      description: "Set a price and start monetizing your course",
      onClick: handlePaymentClick,
    },
    {
      key: "quizzes" as const,
      title: "Create Quizzes",
      description: "Add assessments to test student knowledge and track progress",
      onClick: handleQuizClick,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-xl font-semibold text-[#101A33] mb-6">
          Course Content Options
        </h3>

        <div className="space-y-4">
          {contentOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#4977E6] transition-colors cursor-pointer"
              onClick={option.onClick}
            >
              <input
                type="checkbox"
                checked={options[option.key]}
                onChange={() => {}}
                className="mt-1 w-5 h-5 text-[#4977E6] border-gray-300 rounded focus:ring-[#4977E6]"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-[#101A33] mb-1">
                  {option.title}
                </h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="secondary"
            onClick={() => setCurrentStep(1)}
            className="px-6 py-2"
          >
            Back
          </Button>
          <Button variant="primary" onClick={handleNext} className="px-6 py-2">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

