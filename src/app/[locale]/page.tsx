import Landing from "@/components/Landing/Landing";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/dist/server/api-utils";

type Props = {
  params: { locale: string };
};

export default function Home() {
  redirect("/en/join/");
}
