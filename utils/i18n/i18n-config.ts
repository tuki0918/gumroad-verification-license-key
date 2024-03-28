export const locales = ["ja", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

export const i18n = {
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
} as const;
