import Landing from "@/components/Landing/Landing";
import { setRequestLocale } from "next-intl/server";


type Props = {
  params: {locale: string};
};

export default function Home({params: {locale}}: Props) {
  setRequestLocale(locale);
  return (
    <>
      <main>
        <Landing />
      </main>
    </>
  );
}
