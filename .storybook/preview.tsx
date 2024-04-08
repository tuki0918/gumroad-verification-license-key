import type { Preview } from "@storybook/react";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import "./../app/globals.css";
import { loadLocaleMessages } from "./../utils/i18n/i18n";

const withLocaleProvider = (Story, { globals: { locale } }) => {
  const messages = loadLocaleMessages(locale);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Story />
    </NextIntlClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  globalTypes: {
    locale: {
      description: "Internationalization locale",
      defaultValue: "ja",
      toolbar: {
        icon: "globe",
        items: [
          { value: "ja", right: "🇯🇵", title: "日本語" },
          { value: "en", right: "🇺🇸", title: "English" },
        ],
      },
    },
  },
  decorators: [withLocaleProvider],
};

export default preview;
