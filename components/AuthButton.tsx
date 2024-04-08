"use client";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export const LoginButton = () => {
  const t = useTranslations("AuthButton");
  return (
    <button className="btn text-xs" onClick={() => signIn()}>
      {t("LoginButton/login")}
    </button>
  );
};

export const LogoutButton = () => {
  const t = useTranslations("AuthButton");
  return (
    <button className="btn text-xs" onClick={() => signOut()}>
      {t("LogoutButton/logout")}
    </button>
  );
};
