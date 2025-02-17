export default function ChecklistLayout({
  breadcrumb,
  children,
}: Readonly<{
  breadcrumb: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      {breadcrumb}
      {children}
    </div>
  );
}
