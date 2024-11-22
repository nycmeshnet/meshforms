import "@/app/global.css";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import deepmerge from "deepmerge";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    notFound();
  }

  // Provide all messages to the client
  const localeMessages = await getMessages({locale});
  const defaultMessages = await getMessages({locale: 'en'});
  const messages = deepmerge(defaultMessages, localeMessages);

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
