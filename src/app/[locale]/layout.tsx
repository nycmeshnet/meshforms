import "@/app/global.css";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import deepmerge from "deepmerge";
import { EnvThemeProvider } from "@/lib/EnvThemeProvider";
import { IsDeveloperProvider } from "@/lib/AckDevProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "@/components/Header/Header";
import { Box } from "@mui/system";
import Container from "@mui/material/Container";
import { Footer } from "@/components/Footer/Footer";
import { EnvProvider } from "@/lib/EnvProvider";
import * as React from "react";

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
  const localeMessages = await getMessages({ locale });
  const defaultMessages = await getMessages({ locale: "en" });
  const messages = deepmerge(defaultMessages, localeMessages);

  return (
    <NextIntlClientProvider messages={messages}>
      <EnvProvider>
        <EnvThemeProvider>
          <IsDeveloperProvider>
            <CssBaseline />
            <Header />
            <Box sx={{ width: "100%", backgroundColor: "background.default" }}>
              <Container maxWidth="lg" sx={{ py: { md: "3rem", sm: "1rem" } }}>
                {children}
              </Container>
            </Box>
            <Footer />
          </IsDeveloperProvider>
        </EnvThemeProvider>
      </EnvProvider>
    </NextIntlClientProvider>
  );
}
