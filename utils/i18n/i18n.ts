import { getRequestConfig } from "next-intl/server";
import { Locale } from "./i18n-config";
import locale_en from "./locales/en.json";
import locale_ja from "./locales/ja.json";

// Simple and workable implementation in storybook
export const loadLocaleMessages = (
  locale: Locale,
): {
  [key: string]: { [name: string]: string };
} => {
  switch (locale) {
    case "en":
      return locale_en;
    case "ja":
      return locale_ja;
    default:
      return locale_ja;
  }
};

export default getRequestConfig(({ locale }) => {
  const messages = loadLocaleMessages(locale as Locale);
  return { messages };
});
