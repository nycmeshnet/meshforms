import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import JoinForm from "@/components/JoinForm/JoinForm";
import Head from "next/head";

export const metadata = {
  title: "Join Our Community Network!",
  description: "Use this form to sign up for NYC Mesh",
};

export default async function Join() {
  return (
    <>
      <main>
        <JoinForm />
      </main>
    </>
  );
}
