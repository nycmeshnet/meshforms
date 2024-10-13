import { JoinFormResponse } from "@/app/io";
import { http, HttpResponse } from "msw";
import { expectedAPIRequestData } from "../util";
import { isDeepStrictEqual } from "util";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";

export default [
  http.post("/api/v1/join/", async ({ request }) => {
    console.debug("Hello from mocked join API.");
    const joinRequest: JoinFormValues = await request.json();

    if (!joinRequest.trust_me_bro) {
      if (joinRequest.state === "NJ" || joinRequest.state === "New Jersey") {
        return HttpResponse.json(
          {
            detail:
              "Mock: Non-NYC registrations are not supported at this time.",
          },
          { status: 400 },
        );
      }

      if (joinRequest.street_address === "197 prospect pl") {
        return HttpResponse.json(
          {
            detail: "Mock: Please confirm a few details.",
            building_id: "",
            member_id: "",
            install_id: "",
            install_number: "",
            member_exists: "",
            changed_info: { street_address: "197 Prospect Place" },
          },
          { status: 409 },
        );
      }

      if (joinRequest.city === "brooklyn") {
        return HttpResponse.json(
          {
            detail: "Mock: Please confirm a few details.",
            building_id: "",
            member_id: "",
            install_id: "",
            install_number: "",
            member_exists: "",
            changed_info: { city: "Brooklyn" },
          },
          { status: 409 },
        );
      }

      if (!isDeepStrictEqual(joinRequest, expectedAPIRequestData)) {
        console.error(
          "Mock Join API is returning 400. (request is not deeply equal)",
        );
        console.error("Expected the following:");
        console.error(expectedAPIRequestData);
        return HttpResponse.json(
          { detail: "Mock failure. Request does not match expected request." },
          { status: 400 },
        );
      }
    }

    const json = {
      message: "",
      building_id: "1000",
      member_id: "1001",
      install_number: "1002",
      member_exists: "false",
    };

    return HttpResponse.json(json, { status: 201 });
  }),
];
