// Root admin layout — no sidebar here, each sub-section has its own layout
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
