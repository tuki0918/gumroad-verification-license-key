import ClientProvider from "@/providers/ClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProvider>{children}</ClientProvider>;
}
