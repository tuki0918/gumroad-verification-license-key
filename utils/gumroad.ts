import type {
  ApiSubscriptionResponse,
  ApiVerifyLicenseResponse,
} from "@/types/gumroad";
import { z } from "zod";

const licenseKeySchema = z
  .string()
  .regex(/^[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}$/i);
export const isLicenseKeyFormat = (code: string): boolean => {
  try {
    licenseKeySchema.parse(code);
    return true;
  } catch (e) {
    console.error("Invalid license key format:", e);
    return false;
  }
};

export const verifyLicense = async (productId: string, licenseKey: string) => {
  const endpoint = "https://api.gumroad.com/v2/licenses/verify";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      license_key: licenseKey,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(data);
    throw new Error("Failed to fetch data");
  }
  return data as Promise<ApiVerifyLicenseResponse>;
};

export const fetchSubscription = async (subscriptionId: string) => {
  const params = new URLSearchParams();
  params.append("access_token", process.env.GUMROAD_ACCESS_TOKEN || "");
  const endpoint = `https://api.gumroad.com/v2/subscribers/${subscriptionId}?${params.toString()}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(data);
    throw new Error("Failed to fetch data");
  }
  return data as Promise<ApiSubscriptionResponse>;
};
