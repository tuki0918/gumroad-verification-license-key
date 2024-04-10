"use client";
import { LoginButton } from "@/components/AuthButton";
import { useTranslations } from "next-intl";

const Login = () => {
  const t = useTranslations("Login");
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="stroke-slate mx-auto h-12 w-auto stroke-[1.5px]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
      />
    </svg>
  );

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-md bg-white p-8 shadow-md">
          <div>{icon}</div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t("caption")}
          </h2>

          <div className="mt-4 flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
