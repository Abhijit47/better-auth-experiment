export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className={'px-4 2xl:px-0 w-full h-full'}>{children}</main>;
}
