import { getPanoEndpoint } from "@/app/endpoint";
import { ModelType } from "@/app/types";
import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

export default async function ViewByNetworkNumber({
  params,
}: {
  params: Promise<{ network_number: string }>;
}) {
  const { network_number } = await params;
  const panoEndpoint = await getPanoEndpoint();
  return (
    <>
      <main>
        <PanoramaViewer
          urlModelNumber={network_number}
          urlModelType={ModelType.NetworkNumber}
          panoEndpoint={panoEndpoint}
        />
      </main>
    </>
  );
}
