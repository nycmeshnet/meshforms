import { getPanoEndpoint, panoEnabled } from "@/lib/endpoint";
import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

async function chom() {
  "use server";
  console.log(process.env.PANO_URL);
  return process.env.PANO_URL;
}

export default async function Page() {
  return (
    <>
      <main>
        <PanoramaViewer urlModelNumber={""} urlModelType={undefined} />
      </main>
    </>
  );
}
