import { client } from "@/utils/prisma";
import { verifyLicense } from "@/utils/gumroad";

async function getCount(license_key: string) {
  const count = await client.license.count({
    where: { key: license_key },
  });
  return count;
}

export const POST = async (req: Request) => {
  try {
    const { product_id, license_key } = await req.json();
    const count = await getCount(license_key);
    if (count > 0) {
      console.log("License already exists key:", license_key, "exists:", count);
    }

    const res = await verifyLicense(product_id, license_key);
    if (res.success === false) {
      console.error(res.message);
      throw new Error("Failed to verify license:" + license_key);
    }

    const { uses, purchase: data } = res;
    console.log("Verified license key:", license_key, "uses:", uses);

    // if (data?.test) {
    //   return Response.json(
    //     { success: false, message: "Skipping verification for test purchase" },
    //     { status: 500 }
    //   );
    // }

    await client.license.create({
      data: {
        key: data.license_key,
        order_number: String(data.order_number),
        purchased_at: data.sale_timestamp,
        product_id: data.product_id,
        product_name: data.product_name,
        product_permalink: data.product_permalink,
        variants: data.variants,
        price: data.price,
        quantity: data.quantity,
        currency: data.currency,
        recurrence: data.recurrence,
        refunded: data.refunded,
        subscription_ended_at: data.subscription_ended_at,
        subscription_cancelled_at: data.subscription_cancelled_at,
        subscription_failed_at: data.subscription_failed_at,
      },
    });

    return Response.json({ success: true, message: "Success" });
  } catch (err) {
    console.log(err);
    return Response.json({ success: false, message: "Error" }, { status: 500 });
  }
};
