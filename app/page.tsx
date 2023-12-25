import { client } from "@/utils/prisma";
import { License } from "@/domains/License";
import RedeemLicenseList from "@/components/RedeemLicenseList";

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
      <div className="z-10 max-w-4/5 items-center justify-between font-mono text-sm lg:flex">
        <div className="overflow-x-auto">
          <RedeemLicenseList items={items} />
        </div>
      </div>
    </main>
  );
}
