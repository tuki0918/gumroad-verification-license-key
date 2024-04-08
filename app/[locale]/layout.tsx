import "@/app/globals.css";
import { loadLocaleMessages } from "@/utils/i18n/i18n";
import { Locale, locales } from "@/utils/i18n/i18n-config";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function LocalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();
  const messages = loadLocaleMessages(locale);

  return (
    <html lang={locale} data-theme="business">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
