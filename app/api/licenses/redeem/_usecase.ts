import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { prepare } from "./_prepare";
import { store } from "./_store";

const DISCORD_GRANT_COMMON_ROLE_ID = process.env.DISCORD_GRANT_COMMON_ROLE_ID;

export const execute = async (params: {
  productId: string;
  licenseKey: string;
  discordId: string;
}): Promise<{
  redeemLicense: RedeemLicenseWithoutID;
  subscription: SubscriptionWithoutID | null;
}> => {
  const { productId, licenseKey, discordId } = params;
  const { redeemLicense, subscription } = await prepare(
    productId,
    licenseKey,
    discordId,
  );

  // grant common role
  if (DISCORD_GRANT_COMMON_ROLE_ID !== undefined) {
    redeemLicense.addDiscordGrantRole(DISCORD_GRANT_COMMON_ROLE_ID);
  }

  await store(redeemLicense, subscription);

  return { redeemLicense, subscription };
};
