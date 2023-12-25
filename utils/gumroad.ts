import type { ApiVerifyLicenseResponse } from "@/types/gumroad";

export const verifyLicense = async (
  product_id: string,
  license_key: string
) => {
  const endpoint = "https://api.gumroad.com/v2/licenses/verify";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product_id, license_key }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(data);
    throw new Error("Failed to fetch data");
  }
  return data as Promise<ApiVerifyLicenseResponse>;
};
