import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const m = (await import(`../messages/${locale}.json`)).default;

  console.log(`Locale is: ${locale}`);
  console.log(`Messages are: ${JSON.stringify(m)}`);

  return {
    locale,
    messages: m,
  };
});
