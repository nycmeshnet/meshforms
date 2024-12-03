import "@/app/global.css";
import {
  getEnvironment,
  getRumApplicationID,
  getRumClientToken,
} from "@/lib/endpoint";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Script from "next/script";
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
      <Script id="datadog-rum">
        {`
          (function(h,o,u,n,d) {
            h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
            d=o.createElement(u);d.async=1;d.src=n
            n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
          })(window,document,'script','https://www.datadoghq-browser-agent.com/us1/v5/datadog-rum.js','DD_RUM')
          window.DD_RUM.onReady(function() {
            window.DD_RUM.init({
              clientToken: '${await getRumClientToken()}',
              applicationId: '${await getRumApplicationID()}',
              site: 'us5.datadoghq.com',
              service: 'meshforms',
              env: '${await getEnvironment()}',
              // Specify a version number to identify the deployed version of your application in Datadog
              // version: '1.0.0',
              sessionSampleRate: 100,
              sessionReplaySampleRate: 100,
              trackUserInteractions: true,
              trackResources: true,
              trackLongTasks: true,
            });
          })
       `}
      </Script>

      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
