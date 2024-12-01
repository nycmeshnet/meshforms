import "@/app/global.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import * as React from "react";

export const metadata = {
  title: "meshdb-forms by NYC Mesh",
  description: "A tool for members and volunteers to interact with MeshDB",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
