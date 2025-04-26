import { getPanoEndpoint } from "@/lib/endpoint";
import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

export default async function PanoramaUpload() {
  if (!process.env.ENABLE_PANO_UI) {
    return null;
  }

  const panoEndpoint = await getPanoEndpoint();
  return (
    <>
      <main>
        <PanoramaViewer
          urlModelNumber={""}
          urlModelType={undefined}
          panoEndpoint={panoEndpoint}
        />
      </main>
    </>
  );
}
