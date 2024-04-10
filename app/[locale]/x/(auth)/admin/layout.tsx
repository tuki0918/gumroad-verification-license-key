import { NavBarWithSession } from "@/components/layout/NavBar";
import ClientProvider from "@/providers/ClientProvider";
import { auth } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // If the user is not an admin, redirect to the homepage
  if (session?.user?.role !== "admin") redirect("/");

  return (
    <ClientProvider>
      <div className="container m-auto">
        <div>
          <NavBarWithSession session={session} />
        </div>
        <div>{children}</div>
      </div>
    </ClientProvider>
  );
}
