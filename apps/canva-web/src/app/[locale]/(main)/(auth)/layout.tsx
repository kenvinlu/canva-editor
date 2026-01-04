export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getSession();

  // if (!isEmpty(session)) {
  //   redirect("/dashboard");
  // }

  return <>{children}</>;
}
