import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "Upload Panoramas and other Install Photos",
  description: "Submit photos taken from rooftops or other documentation",
};

export default async function PanoramaUpload() {
  return (
    <>
      <main>
        <PanoramaViewer />
      </main>
    </>
  );
}
