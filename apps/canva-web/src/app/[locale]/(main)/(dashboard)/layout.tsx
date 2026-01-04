import { DashboardLayoutClient } from "./layout.client";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <div className="container mx-auto max-w-4xl">
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </div>
    </>
  );
}
