export default function PopUpModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-[700px] rounded-lg px-4 sm:px-6 md:px-10 pt-12 pb-6 relative max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
