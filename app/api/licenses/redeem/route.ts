import { CustomError } from "@/app/api/_errors";
import { execute } from "@/app/api/licenses/redeem/_usecase";

export const POST = async (req: Request) => {
  // NOTE: License key can be redeemed as long as it is valid
  try {
    const { product_id, license_key, discord_id } = await req.json();
    console.log(`Redeem license: ${license_key}: ${discord_id}`);

    const { redeemLicense } = await execute(
      product_id,
      license_key,
      discord_id,
    );

    return Response.json({
      success: true,
      message: "Success",
      data: {
        discord_id: redeemLicense.discordId,
        discord_grant_roles: redeemLicense.discordGrantRoles,
      },
    });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) {
      return Response.json(
        { success: false, message: err.message, code: err.code },
        { status: 500 },
      );
    }
    return Response.json(
      { success: false, message: "Error", code: "UNKNOWN" },
      { status: 500 },
    );
  }
};
