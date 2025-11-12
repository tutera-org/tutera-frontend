import { CourseProvider } from "@/components/Course Management/CourseContext";
import CreatorHeader from "@/components/Reuse/CreatorHeader";



export default function CourseManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  
    <CourseProvider>
      <CreatorHeader />
      {children}
    </CourseProvider>
  );
}
