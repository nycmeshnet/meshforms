import { http, HttpResponse } from "msw";
import {
  JoinFormResponse,
} from "@/components/JoinForm/JoinForm";

export default [
  http.post("/api/v1/join/", async ({ request }) => {
    console.debug("Hello from mocked join API. I'm gonna return a 500 now :)");
    
    let r = new JoinFormResponse();
    r.detail = "Mock: A server error has occurred.";

    return HttpResponse.json(r, { status: 500 });
  }),
  http.post("/api/v1/nn-assign/", async ({ request }) => {
    console.debug("Hello from mocked NN Assign API.");

    return HttpResponse.json(
      { detail: "Mock: A server error has occurred." },
      { status: 500 },
    );
  }),
];
