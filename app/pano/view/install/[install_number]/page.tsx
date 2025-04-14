import { ModelType } from "@/app/types";
import PanoramaViewer, {
} from "@/components/PanoramaViewer/PanoramaViewer";

export const metadata = {
  title: "View Images on pano",
  description: "View photos taken from rooftops or other install documentation",
};

export default async function ViewByInstallNumber({
  params,
}: {
  params: Promise<{ install_number: string }>;
}) {
  const { install_number } = await params;
  return (
    <>
      <main>
        <PanoramaViewer
          urlModelNumber={install_number}
          urlModelType={ModelType.InstallNumber}
        />
      </main>
    </>
  );
}

