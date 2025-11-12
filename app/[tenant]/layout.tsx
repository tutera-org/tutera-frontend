import CreatorHeader from "@/components/Reuse/CreatorHeader";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-200 min-h-screen">
      <main className="w-[90%] mx-auto pt-5">
        <CreatorHeader />
        {children}
      </main>
    </div>
  );
}
