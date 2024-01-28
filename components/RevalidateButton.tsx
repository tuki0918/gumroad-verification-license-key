"use client";
import { useRouter } from "next/navigation";
import { FC } from "react";

const RevalidateButton: FC<{ code: string }> = ({ code }) => {
  const router = useRouter();
  const handleRevalidate = async (code: string) => {
    try {
      const res = await fetch("/api/licenses/revalidate", {
        method: "POST",
        body: JSON.stringify({
          license_key: code,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.ok) {
        router.refresh();
      } else {
        console.log("Oops! Something is wrong.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className="btn btn-ghost btn-xs text-red-600"
      onClick={() => void handleRevalidate(code)}
    >
      ●
    </button>
  );
};

export default RevalidateButton;
