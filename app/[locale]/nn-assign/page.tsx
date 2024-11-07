import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { NNAssignForm } from "@/components/NNAssignForm/NNAssignForm";

export const metadata = {
  title: "Assign a Network Number",
  description: "Assign a Network Number to an existing Install",
};

export default async function NNAssign() {
  return (
    <>
      <main>
        <NNAssignForm />
      </main>
    </>
  );
}
