import "./global.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Box } from "@mui/system";
import Container from "@mui/material/Container";

export const metadata = {
  title: "meshdb-forms by NYC Mesh",
  description: "A tool for members and volunteers to interact with MeshDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#f4f4f4" }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <Box sx={{ width: "100%", backgroundColor: "white" }}>
              <Container maxWidth="lg" sx={{ py: { md: "3rem", sm: "1rem" } }}>
                {children}
              </Container>
            </Box>
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
