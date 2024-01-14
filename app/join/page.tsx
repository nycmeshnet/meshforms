import { JoinForm } from "@/components/JoinForm/JoinForm";
import { Header } from "@/components/Header/Header";


// TODO:
// https://www.npmjs.com/package/react-phone-number-input
// https://www.npmjs.com/package/react-error-boundary

export default async function Join() {
  return <>
    <Header/>
    <main>
      <JoinForm />
    </main>
  </>
}
