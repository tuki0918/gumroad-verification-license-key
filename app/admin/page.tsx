import AdminDashboard from "@/components/AdminDashboard";
import { client } from "@/utils/prisma";

async function getData() {
  const data = await client.subscription.findMany({
    orderBy: [
      {
        updated_at: "asc",
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4/5 z-10 items-center justify-between font-mono text-sm lg:flex">
        <div className="overflow-x-auto">
          <AdminDashboard data={data} />
        </div>
      </div>
    </main>
  );
}
