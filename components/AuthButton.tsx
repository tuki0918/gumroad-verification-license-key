"use client";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export const LoginButton = () => {
  const t = useTranslations("AuthButton");
  return (
    <button
      className="btn btn-info btn-wide text-white"
      onClick={() => signIn()}
    >
      {t("LoginButton/login")}
    </button>
  );
};

export const LogoutButton = () => {
  const t = useTranslations("AuthButton");
  return <button onClick={() => signOut()}>{t("LogoutButton/logout")}</button>;
};
