import CreatorHeader from "@/components/Reuse/CreatorHeader";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CreatorHeader />
      <main>{children}</main>
    </>
  );
}
