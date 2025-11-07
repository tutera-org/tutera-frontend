function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="fixed inset-0 bg-[#000000]/50 flex items-center justify-center z-50 backdrop-blur-sm">
      {children}
    </main>
  );
}

export default AuthLayout;
