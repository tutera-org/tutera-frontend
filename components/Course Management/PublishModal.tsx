"use client";

import Button from "../Reuse/Button";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function PublishModal({
  isOpen,
  onClose,
  onConfirm,
  onBack,
}: PublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-[90%] relative z-101">
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

        {/* Success icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shrink-0">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#101A33] mb-2">
              Course upload successful
            </h3>
            <p className="text-gray-600 text-lg">
              Do you want to publish it?
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onBack} className="px-6 py-2">
            Back
          </Button>
          <Button variant="primary" onClick={onConfirm} className="px-6 py-2">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

