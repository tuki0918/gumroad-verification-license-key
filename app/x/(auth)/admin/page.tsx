import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import { LogoutButton } from "@/components/AuthButton";
import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";

async function getData() {
  const data = await prisma.subscription.findMany({
    orderBy: [
      {
        started_at: "asc",
      },
    ],
    include: {
      redeemLicenses: true,
    },
  });
  return data;
}

export default async function Home() {
  const session = await auth();
  const data = await getData();

  // If the user is not an admin, redirect to the homepage
  if (session?.user?.role !== "admin") redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4/5 z-10 items-center justify-between font-mono text-sm lg:flex">
        <div className="overflow-x-auto">
          <div className="text-right">
            Logined: {session?.user?.name} ({session?.user?.email})
            <LogoutButton />
          </div>
          <AdminDashboard data={data} />
        </div>
      </div>
    </main>
  );
}
