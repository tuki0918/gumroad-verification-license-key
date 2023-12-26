import RedeemLicenseList from "@/components/RedeemLicenseList";
import { License } from "@/domains/License";
import { client } from "@/utils/prisma";

async function getData() {
  const data = await client.license.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  return data;
}

export default async function Home() {
  const data = await getData();
  const items = data.map((item) => License.create(item));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4/5 z-10 items-center justify-between font-mono text-sm lg:flex">
        <div className="overflow-x-auto">
          <RedeemLicenseList items={items} />
        </div>
      </div>
    </main>
  );
}
