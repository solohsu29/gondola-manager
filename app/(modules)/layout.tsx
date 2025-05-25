import PageLayout from "@/components/layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <PageLayout>{children}</PageLayout>
   
  );
}
