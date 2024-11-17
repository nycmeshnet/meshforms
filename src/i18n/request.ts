import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const m = await getMessages(locale);

  return {
    locale,
    messages: m,
  };
});

// I have no fuckignc clue why this shit doesn't work normally but I _have_
// to have some kind of branching conditional to get the messages to import
// correctly. I am so sorry.
async function getMessages(locale: string) {
  switch (locale) {
    case "en":
      return (await import(`../../messages/en.json`)).default;
    case "es":
      return (await import(`../../messages/es.json`)).default;
    case "fr":
      return (await import(`../../messages/fr.json`)).default;
    case "zh":
      return (await import(`../../messages/zh.json`)).default;
  }
}
