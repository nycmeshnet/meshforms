import { JoinFormResponse } from "@/app/io";
import { http, HttpResponse } from "msw";
import { expectedAPIRequestData } from "../util";
import { isDeepStrictEqual } from "util";

export default [
  http.post("/api/v1/join/", async ({ request }) => {
    console.log("Hello from mocked join API.");
    const joinRequest = await request.json();

    if (!isDeepStrictEqual(joinRequest, expectedAPIRequestData)) {
      console.error("Mock Join API is returning 400.");
      return HttpResponse.json(
        { detail: "Mock failure. Request does not match expected request." },
        { status: 400 },
      );
    }

    const json: JoinFormResponse = JoinFormResponse.parse({
      message: "",
      building_id: 1000,
      member_id: 1001,
      install_number: 1002,
      member_exists: false,
    });

    return HttpResponse.json(json, { status: 201 });
  }),
];
