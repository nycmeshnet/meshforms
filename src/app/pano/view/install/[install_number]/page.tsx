import { getPanoEndpoint } from "@/lib/endpoint";
import { ModelType } from "@/app/types";
import PanoramaViewer from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

export default async function ViewByInstallNumber({
  params,
}: {
  params: Promise<{ install_number: string }>;
}) {
  if (process.env.ENABLE_PANO_UI === "true") {
    console.warn("Pano is disabled");
    return null;
  }

  const { install_number } = await params;
  const panoEndpoint = await getPanoEndpoint();
  return (
    <>
      <main>
        <PanoramaViewer
          urlModelNumber={install_number}
          urlModelType={ModelType.InstallNumber}
          panoEndpoint={panoEndpoint}
        />
      </main>
    </>
  );
}
