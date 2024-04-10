import AdminDashboard from "@/components/AdminDashboard";
import prisma from "@/libs/prisma";

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
  const data = await getData();
  return (
    <main>
      <AdminDashboard data={data} />
    </main>
  );
}
