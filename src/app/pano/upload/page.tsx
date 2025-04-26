// Idea: Have people validate their panoramas with their email?

import { getPanoEndpoint } from "@/lib/endpoint";
import PanoramaUploader from "@/components/PanoramaUpload/PanoramaUpload";

export const metadata = {
  title: "Upload Panoramas and other Install Photos",
  description: "Submit photos taken from rooftops or other documentation",
};

export default async function PanoramaUpload() {
  if (!process.env.ENABLE_PANO_UI) {
    return null;
  }

  const panoEndpoint = await getPanoEndpoint();
  return (
    <>
      <main>
        <PanoramaUploader panoEndpoint={panoEndpoint}/>
      </main>
    </>
  );
}
