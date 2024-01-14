import { JoinForm } from "@/app/JoinForm";


// TODO:
// https://www.npmjs.com/package/react-phone-number-input
// https://www.npmjs.com/package/react-error-boundary

export default async function Home() {
  return (
    <main>
      <h1 className="sr-only">Todos</h1>
      <JoinForm />
    </main>
  );
}
