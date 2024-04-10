"use client";
import { LogoutButton } from "@/components/AuthButton";
import { APP_DATA } from "@/constants/appdata";
import { UserAccount } from "@/domains/UserAccount";
import { useSettings } from "@/providers/SettingsProvider";
import { Session } from "next-auth";
import Image from "next/image";
import { FC, useCallback } from "react";

const HambugerIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="inline-block h-5 w-5 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  );
};

const NoImageAvatar = () => {
  return (
    <svg
      className="absolute -left-1 h-8 w-8 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NavBar: FC<{ siteName: string; user: UserAccount }> = ({
  siteName,
  user,
}) => {
  const { settings, updateSettings } = useSettings();

  const handleHambugerClick = useCallback(() => {
    updateSettings({ isSideMenuOpen: !settings.isSideMenuOpen });
  }, [settings.isSideMenuOpen, updateSettings]);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <button
          className="btn btn-circle btn-ghost"
          onClick={handleHambugerClick}
        >
          <HambugerIcon />
        </button>
      </div>
      <div className="flex-1">
        <span className="mx-4 text-xl">{siteName}</span>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <div className="avatar">
          <div className="w-8 rounded-full">
            {user.image === null ? (
              <NoImageAvatar />
            ) : (
              <Image
                src={user.image}
                width={64}
                height={64}
                alt="profile avatar"
              />
            )}
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};

export const NavBarWithSession: FC<{ session: Session }> = ({ session }) => {
  const user = UserAccount.createFromUnmarshalledSession(session);
  return <NavBar siteName={APP_DATA.APP_NAME} user={user} />;
};

export default NavBar;
