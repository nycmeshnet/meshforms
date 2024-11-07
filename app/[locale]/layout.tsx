import "@/app/global.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Box } from "@mui/system";
import Container from "@mui/material/Container";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';

export const metadata = {
  title: "meshdb-forms by NYC Mesh",
  description: "A tool for members and volunteers to interact with MeshDB",
};

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
    params: {locale: string};
}) {

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Provide all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body style={{ backgroundColor: "#f4f4f4" }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <Box sx={{ width: "100%", backgroundColor: "white" }}>
              <Container maxWidth="lg" sx={{ py: { md: "3rem", sm: "1rem" } }}>
                <NextIntlClientProvider messages={messages}>
                  {children}
                </NextIntlClientProvider>
              </Container>
            </Box>
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
