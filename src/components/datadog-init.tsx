// Necessary if using App Router to ensure this file runs on the client
"use client";

import { getEnvironment, getRumApplicationID, getRumClientToken } from "@/lib/endpoint";
import { datadogRum } from "@datadog/browser-rum";

datadogRum.init({
  applicationId: await getRumApplicationID(),
  clientToken: await getRumClientToken(),
  site: "datadoghq.com",
  service: "meshforms",
  env: await getEnvironment(),
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  // Specify URLs to propagate trace headers for connection between RUM and backend trace
  allowedTracingUrls: [
    { match: "https://example.com/api/", propagatorTypes: ["tracecontext"] },
  ],
});

export default function DatadogInit() {
  // Render nothing - this component is only included so that the init code
  // above will run client-side
  return null;
}
