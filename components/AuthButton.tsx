"use client";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export const LoginButton = () => {
  const t = useTranslations("AuthButton");
  return (
    <button className="btn" onClick={() => signIn()}>
      {t("LoginButton/login")}
    </button>
  );
};

export const LogoutButton = () => {
  const t = useTranslations("AuthButton");
  return (
    <button className="btn" onClick={() => signOut()}>
      {t("LogoutButton/logout")}
    </button>
  );
};
