import "../../../styles/maintainance.css";

export default function NoTenantFoundLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Page Maintenance</title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
