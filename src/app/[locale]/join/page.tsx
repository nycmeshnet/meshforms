import JoinForm from "@/components/JoinForm/JoinForm";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Join Our Community Network!",
  description: "Use this form to sign up for NYC Mesh",
};

type Props = {
  params: { locale: string };
};

export default function Join({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <>
      <main>
        <JoinForm />
      </main>
    </>
  );
}
