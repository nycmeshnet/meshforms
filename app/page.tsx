import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

import Landing from "@/components/Landing/Landing";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <main>
        <Landing />
      </main>
    </>
  );
}
