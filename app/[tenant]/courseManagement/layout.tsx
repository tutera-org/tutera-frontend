import { CourseProvider } from "@/components/Course Management/CourseContext";




export default function CourseManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  
    <CourseProvider>
   
      {children}
    </CourseProvider>
  );
}
