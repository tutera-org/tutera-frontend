"use client";

import Button from "../Reuse/Button";

interface CourseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  courseTitle: string;
  isDeleting?: boolean;
}

export default function CourseDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  courseTitle,
  isDeleting = false,
}: CourseDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-100 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-[90%] relative z-101"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Warning icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#101A33] mb-2">
              Delete Course?
            </h3>
            <p className="text-gray-600">
              Are you sure you want to delete {courseTitle}? This action
              cannot be undone.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" onClick={onClose} className="px-6 py-2">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

