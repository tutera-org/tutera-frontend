"use client";

import { useState, useEffect, useRef } from "react";
import Button from "../Reuse/Button";
import { useCourse } from "./CourseContext";
import PublishModal from "./PublishModal";

export default function SetUp() {
  const {
    updateCurrentCourse,
    addCourse,
    updateCourseStatus,
    currentCourse,
    setCurrentStep,
  } = useCourse();
  const [paymentOption, setPaymentOption] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [certificate, setCertificate] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Load existing data from currentCourse
  useEffect(() => {
    if (currentCourse && !hasLoadedRef.current) {
      if (currentCourse.isPaid) {
        setPaymentOption("paid");
      } else {
        setPaymentOption("free");
      }
      if (currentCourse.price) {
        setPrice(currentCourse.price.toString());
      }
      if (currentCourse.certificate) {
        setCertificate(currentCourse.certificate);
      }
      hasLoadedRef.current = true;
    } else if (!currentCourse) {
      hasLoadedRef.current = false;
    }
  }, [currentCourse]);

  // Auto-save payment option, price, and certificate changes
  useEffect(() => {
    if (hasLoadedRef.current) {
      const timeoutId = setTimeout(() => {
        updateCurrentCourse({
          isPaid: paymentOption === "paid",
          price: paymentOption === "paid" ? parseFloat(price) || 0 : 0,
          certificate: certificate,
        });
      }, 300); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [paymentOption, price, certificate, updateCurrentCourse]);

  // Helper to generate unique ID (client-side only)
  const generateCourseId = () => {
    if (typeof window === "undefined") return "temp-id";
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleNext = () => {
    const courseData = {
      id: generateCourseId(),
      title: currentCourse?.title || "",
      description: currentCourse?.description || "",
      thumbnail: currentCourse?.thumbnail || "",
      price: paymentOption === "paid" ? parseFloat(price) || 0 : 0,
      isPaid: paymentOption === "paid",
      modules: currentCourse?.modules || [],
      certificate: certificate,
      ratings: currentCourse?.ratings || false,
      quizzes: currentCourse?.quizzes || [],
      createdAt: new Date().toISOString(),
      status: "draft" as const, // Save as draft initially
    };

    // Add course as draft first, but keep the current step so modal can show
    addCourse(courseData, true);
    setPendingCourseId(courseData.id);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = () => {
    if (pendingCourseId) {
      updateCourseStatus(pendingCourseId, "published");
      setPendingCourseId(null);
      setShowPublishModal(false);
      setCurrentStep(0); // Go back to course list
    }
  };

  const handleBackFromModal = () => {
    // Course is already saved as draft, just close modal and go back
    setPendingCourseId(null);
    setShowPublishModal(false);
    setCurrentStep(0); // Go back to course list
  };

  const handleCloseModal = () => {
    // Course is already saved as draft, just close modal and go back
    setPendingCourseId(null);
    setShowPublishModal(false);
    setCurrentStep(0); // Go back to course list
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
       <h3 className="text-xl font-semibold text-[#101A33] mb-6">
          Select the features you want to include in your course
        </h3>
      
      
      <div
        className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${
          showPublishModal ? "blur-sm pointer-events-none" : ""
        }`}
      >
       

        {/* Course Content Options */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-[#101A33] mb-4">
            Course Content Options
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={certificate}
                onChange={(e) => setCertificate(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#4977E6] border-gray-300 rounded focus:ring-[#4977E6]"
              />
              <div>
                <label className="font-semibold text-[#101A33] cursor-pointer">
                  Enable Certificate
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Award students a completion certificate when they finish the
                  course.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-[#101A33] mb-4">
            Choose Payment Options
          </h4>
          <div className="space-y-4">
            <div
              onClick={() => {
                setPaymentOption("free");
              }}
              className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                paymentOption === "free"
                  ? "border-[#4977E6] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentOption === "free"}
                onChange={() => {}}
                className="mt-1 w-5 h-5 text-[#4977E6] border-gray-300 focus:ring-[#4977E6]"
              />
              <div>
                <h4 className="font-semibold text-[#101A33] mb-1">
                  Free Course
                </h4>
                <p className="text-sm text-gray-600">
                  Make your course available to everyone at no cost
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                setPaymentOption("paid");
              }}
              className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                paymentOption === "paid"
                  ? "border-[#4977E6] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentOption === "paid"}
                onChange={() => {}}
                className="mt-1 w-5 h-5 text-[#4977E6] border-gray-300 focus:ring-[#4977E6]"
              />
              <div>
                <h4 className="font-semibold text-[#101A33] mb-1">
                  Paid Course
                </h4>
                <p className="text-sm text-gray-600">
                  Set a price for your course content
                </p>
              </div>
            </div>
          </div>
        </div>

        {paymentOption === "paid" && (
          <div className="mb-8">
            <label className="block text-[#101A33] font-semibold mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              placeholder="Amount"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
            />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentStep(2)}
            className="px-6 py-2"
          >
            Previous
          </Button>
          <Button variant="primary" onClick={handleNext} className="px-6 py-2">
            Done
          </Button>
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPublish}
        onBack={handleBackFromModal}
      />
    </div>
  );
}
