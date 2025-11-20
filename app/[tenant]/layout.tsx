import ConditionalNavbar from "@/components/Course Management/ConditionalNavbar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-100 pb-10 min-h-screen">
      <main className="w-[90%] max-w-[1240px] mx-auto pt-5">
        <ConditionalNavbar />

        {children}
      </main>
    </div>
  );
}
