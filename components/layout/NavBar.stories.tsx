import { APP_DATA } from "@/constants/appdata";
import { UserAccount } from "@/domains/UserAccount";
import SettingsProvider from "@/providers/SettingsProvider";
import type { Meta, StoryObj } from "@storybook/react";
import NavBar from "./NavBar";

const meta: Meta<typeof NavBar> = {
  title: "layout/NavBar",
  component: NavBar,
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  render: () => {
    const user = UserAccount.reconstruct({
      id: "UserAccount__id",
      name: "UserAccount__name",
      email: "UserAccount__email",
      image: null,
    });

    return (
      <SettingsProvider>
        <NavBar siteName={APP_DATA.APP_NAME} user={user} />
      </SettingsProvider>
    );
  },
};
