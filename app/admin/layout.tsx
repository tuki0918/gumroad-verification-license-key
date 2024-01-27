import NextAuthProvider from "@/providers/NextAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
