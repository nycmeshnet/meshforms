// Idea: Have people validate their panoramas with their email?

import PanoramaUploadForm from "@/components/PanoramaUpload/PanoramaUpload";

export const metadata = {
  title: "Upload Panoramas and other Install Photos",
  description: "Submit photos taken from rooftops or other documentation",
};

export default async function PanoramaUpload() {
  return (
    <>
      <main>
        <PanoramaUploadForm />
      </main>
    </>
  );
}
