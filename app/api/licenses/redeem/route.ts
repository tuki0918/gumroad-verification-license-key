import { AppError } from "@/app/_exceptions";
import { GumroadGetSubscriptionService } from "@/domains/services/GumroadGetSubscriptionService";
import { GumroadVerifyRedeemLicenseService } from "@/domains/services/GumroadVerifyRedeemLicenseService";
import prisma from "@/libs/prisma";
import { RedeemUseCase } from "./_usecase";
import { PrepareService } from "./_usecase/PrepareService";
export const POST = async (req: Request) => {
  // NOTE: License key can be redeemed as long as it is valid
  try {
    const { product_id, license_key, discord_id } = await req.json();
    console.log(`Redeem license: ${license_key}: ${discord_id}`);

    const prepareService = new PrepareService(
      new GumroadVerifyRedeemLicenseService(),
      new GumroadGetSubscriptionService(),
    );
    const usecase = new RedeemUseCase(prisma, prepareService);
    const { redeemLicense } = await usecase.execute(
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
    if (err instanceof AppError) {
      return Response.json(
        { success: false, message: err.message, code: err.code },
        { status: err.status },
      );
    }
    return Response.json(
      { success: false, message: "Error", code: "UNKNOWN" },
      { status: 500 },
    );
  }
};
