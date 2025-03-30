import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";
import { useRouter } from "next/router";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

export default async function ViewByInstallNumber({
  params,
}: {
  params: Promise<{ installNumber: number }>
}) {
  const { installNumber } = await params;
  return (
    <>
      <main>
        <PanoramaViewer installNumber={installNumber} />
      </main>
    </>
  );
}


export default async function Page({
  params,
}: {
  params: Promise<{ install_number: string }>
}) {
  const { install_number } = await params
  return (
    <>
      <main>
        <PanoramaViewer installNumber={install_number} />
      </main>
    </>
  );
}
