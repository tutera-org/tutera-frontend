// Helper function to generate unique IDs (only called client-side)
export const generateId = (prefix: string) => {
  if (typeof window === "undefined") return `${prefix}-temp`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 6-dot drag handle icon component (3 dots vertically arranged twice) - better for mobile
export const DragHandleIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="14"
    height="18"
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="3.5" cy="4.5" r="1.5" fill="currentColor" />
    <circle cx="3.5" cy="9" r="1.5" fill="currentColor" />
    <circle cx="3.5" cy="13.5" r="1.5" fill="currentColor" />
    <circle cx="10.5" cy="4.5" r="1.5" fill="currentColor" />
    <circle cx="10.5" cy="9" r="1.5" fill="currentColor" />
    <circle cx="10.5" cy="13.5" r="1.5" fill="currentColor" />
  </svg>
);




