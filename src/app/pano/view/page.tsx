import { getPanoEndpoint, panoEnabled } from "@/lib/endpoint";
import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

export default async function Page() {
  if (!panoEnabled()) {
    console.warn("Pano is disabled.");
    return null;
  }

  const panoEndpoint = await getPanoEndpoint();
  console.log(`Got endpoint: ${panoEndpoint}`);
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
