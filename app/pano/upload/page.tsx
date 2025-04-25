// Idea: Have people validate their panoramas with their email?

import { getPanoEndpoint } from "@/app/endpoint";
import PanoramaUploader from "@/components/PanoramaUpload/PanoramaUpload";

export const metadata = {
  title: "Upload Panoramas and other Install Photos",
  description: "Submit photos taken from rooftops or other documentation",
};

export default async function PanoramaUpload() {
  const panoEndpoint = await getPanoEndpoint();
  return (
    <>
      <main>
        <PanoramaUploader panoEndpoint={panoEndpoint}/>
      </main>
    </>
  );
}
