"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import Button from "../Reuse/Button";
import { useCourse, Course } from "./CourseContext";
import PublishModal from "./PublishModal";

export default function SetUp() {
  const {
    updateCurrentCourse,
    addCourse,
    currentCourse,
    setCurrentStep,
    courses,
  } = useCourse();
  const [paymentOption, setPaymentOption] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [certificate, setCertificate] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Track the last course ID to detect when we're editing a different course
  const lastCourseIdRef = useRef<string | undefined>(undefined);

  // Load existing data from currentCourse
  // Reset and reload when course ID changes (for editing)
  useEffect(() => {
    const currentCourseId = currentCourse?.id;

    // Only load data when course ID changes (not when other properties change)
    if (currentCourseId !== lastCourseIdRef.current) {
      lastCourseIdRef.current = currentCourseId;

      // Use startTransition to batch state updates and avoid cascading renders
      startTransition(() => {
        if (currentCourse) {
          // Load data when editing a new course
          if (currentCourse.isPaid !== undefined) {
            setPaymentOption(currentCourse.isPaid ? "paid" : "free");
          } else {
            setPaymentOption("free");
          }
          if (currentCourse.price !== undefined) {
            setPrice(currentCourse.price.toString());
          } else {
            setPrice("");
          }
          if (currentCourse.certificate !== undefined) {
            setCertificate(currentCourse.certificate);
          } else {
            setCertificate(false);
          }
          hasLoadedRef.current = true;
        } else {
          // Reset when no currentCourse
          setPaymentOption("free");
          setPrice("");
          setCertificate(false);
          hasLoadedRef.current = false;
        }
      });
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
    // Update currentCourse with latest payment data before saving
    updateCurrentCourse({
      price: paymentOption === "paid" ? parseFloat(price) || 0 : 0,
      isPaid: paymentOption === "paid",
      certificate: certificate,
    });

    const courseData = {
      id: currentCourse?.id || generateCourseId(), // Use existing ID if editing
      title: currentCourse?.title || "",
      description: currentCourse?.description || "",
      thumbnail: currentCourse?.thumbnail || "",
      price: paymentOption === "paid" ? parseFloat(price) || 0 : 0,
      isPaid: paymentOption === "paid",
      modules: currentCourse?.modules || [],
      certificate: certificate,
      ratings: currentCourse?.ratings || false,
      quizzes: currentCourse?.quizzes || [],
      createdAt: currentCourse?.createdAt || new Date().toISOString(), // Preserve original date if editing
      status: (currentCourse?.status as "draft" | "published") || "draft", // Preserve status if editing
    };

    // Add/update course as draft first, but keep the current step so modal can show
    addCourse(courseData, true);
    setPendingCourseId(courseData.id);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = () => {
    if (pendingCourseId) {
      // Find the original course to preserve any unchanged fields
      const originalCourse = courses.find((c) => c.id === pendingCourseId);

      // Use the CURRENT state values (paymentOption, price, certificate)
      // not from currentCourse, because currentCourse might not have the latest changes
      const finalPrice = paymentOption === "paid" ? parseFloat(price) || 0 : 0;
      const finalIsPaid = paymentOption === "paid";

      // Merge currentCourse data with original course data
      // This ensures unchanged fields are preserved
      const courseData: Course = {
        id: pendingCourseId,
        title: currentCourse?.title ?? originalCourse?.title ?? "",
        description:
          currentCourse?.description ?? originalCourse?.description ?? "",
        thumbnail: currentCourse?.thumbnail ?? originalCourse?.thumbnail ?? "",
        price: finalPrice,
        isPaid: finalIsPaid,
        modules: currentCourse?.modules ?? originalCourse?.modules ?? [],
        certificate: certificate,
        ratings: currentCourse?.ratings ?? originalCourse?.ratings ?? false,
        quizzes: currentCourse?.quizzes ?? originalCourse?.quizzes ?? [],
        createdAt:
          originalCourse?.createdAt ??
          currentCourse?.createdAt ??
          new Date().toISOString(),
        status: "published" as const,
      };
      // Update the course with published status
      addCourse(courseData, false); // Don't keep step, go back to course list
      setPendingCourseId(null);
      setShowPublishModal(false);
    }
  };

  const handleBackFromModal = () => {
    // Go back to SetUp page with all data intact
    // Make sure currentCourse has the latest payment data before closing modal
    updateCurrentCourse({
      isPaid: paymentOption === "paid",
      price: paymentOption === "paid" ? parseFloat(price) || 0 : 0,
      certificate: certificate,
    });
    setPendingCourseId(null);
    setShowPublishModal(false);
    // Stay on step 3 (SetUp) - don't change step
  };

  const handleCloseModal = () => {
    // Go back to SetUp page with all data intact
    setPendingCourseId(null);
    setShowPublishModal(false);
    // Stay on step 3 (SetUp) - don't change step
  };

  return (
    <div className="w-full mx-auto md:w-[80%] md:rounded-lg md:px-6 md:py-4 md:border border-dashed relative">
      <h3 className="text-xl font-semibold text-[#4977E6] mb-2 mt-6">
        Select the features you want to include in your course
      </h3>

      <div
        className={` rounded-2xl  ${
          showPublishModal ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Course Content Options */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-[#101A33] mb-1 bg-white p-2 rounded-[16px]">
            Course Content Options
          </h4>
          <div className="space-y-4 bg-white py-3 rounded-[16px]">
            <div className="flex items-center gap-3 border-2 border-[#C3C3C3] p-3 rounded-[16px]">
              <input
                type="checkbox"
                checked={certificate}
                onChange={(e) => setCertificate(e.target.checked)}
                className=" mt-1 w-5 h-5 text-[#4977E6] border-2 rounded focus:ring-[#4977E6]"
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
          <h4 className="text-lg font-semibold text-[#101A33] mb-1 bg-white p-2 rounded-[16px]">
            Choose Payment Options
          </h4>
          <div className="space-y-4 bg-white p-2 rounded-[16px]">
            <div
              onClick={() => {
                setPaymentOption("free");
              }}
              className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                paymentOption === "free"
                  ? "border-[#4977E6] bg-blue-50"
                  : "border-[#C3C3C3] hover:border-gray-400"
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
                  : "border-[#C3C3C3] hover:border-gray-400"
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
                  className="w-full px-4 py-3 border border-[#C3C3C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
                />
              </div>
            )}
          </div>
        </div>

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
