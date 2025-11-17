import CreatorHeader from "@/components/Reuse/CreatorHeader";
import StudentsNavbar from "@/components/students/Navbar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let role = "creator";
  return (
    <div className="bg-neutral-200 pb-10 min-h-screen">
      <main className="w-[90%] mx-auto pt-5">
        {role === "student" ? <StudentsNavbar /> : <CreatorHeader />}

        {children}
      </main>
    </div>
  );
}
