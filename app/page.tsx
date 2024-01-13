import postgres from "postgres";

import { AddForm } from "@/app/add-form";
import { DeleteForm } from "@/app/delete-form";

export default async function Home() {

  return (
    <main>
      <h1 className="sr-only">Todos</h1>
      <AddForm />
    </main>
  );
}
