import type { Meta, StoryObj } from "@storybook/react";

import AlertMessage from "./AlertMessage";

const meta: Meta<typeof AlertMessage> = {
  title: "ui/AlertMessage",
  component: AlertMessage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlertMessage>;

export const Default: Story = {
  args: {
    message: "This is an alert message",
  },
};

export const Info: Story = {
  args: {
    mode: "info",
    message: "This is an alert message",
  },
};

export const Success: Story = {
  args: {
    mode: "success",
    message: "This is an alert message",
  },
};

export const Warning: Story = {
  args: {
    mode: "warning",
    message: "This is an alert message",
  },
};

export const Error: Story = {
  args: {
    mode: "error",
    message: "This is an alert message",
  },
};
