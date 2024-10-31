import { JoinFormResponse } from "@/app/io";
import { http, HttpResponse } from "msw";
import { expectedAPIRequestData } from "../util";
import { isDeepStrictEqual } from "util";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";

export default [
  http.post("/api/v1/join/", async ({ request }) => {
    console.debug("Hello from mocked join API.");

    const requestJson = await request.json();

    if (requestJson === undefined || requestJson === null) {
      return HttpResponse.json(
        { detail: "Mock: Missing request body" },
        { status: 400 },
      );
    }

    const joinRequest: JoinFormValues = requestJson as JoinFormValues;

    // Special case to test "trust me bro"
    if (joinRequest.street_address === "333 chom st") {
      if (joinRequest.trust_me_bro) {
        const json = {
          message: "",
          building_id: "1000",
          member_id: "1001",
          install_number: "1002",
          member_exists: "false",
        };

        return HttpResponse.json(json, { status: 201 });
      }

      return HttpResponse.json(
        {
          detail: "Mock: Please confirm a few details.",
          building_id: "",
          member_id: "",
          install_id: "",
          install_number: "",
          member_exists: "",
          changed_info: { street_address: "333 Chom Street" },
        },
        { status: 409 },
      );
    }

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
        console.error("Got the follwing:");
        console.error(joinRequest);
        return HttpResponse.json(
          { detail: "Mock failure. Request does not match expected request." },
          { status: 400 },
        );
      }
    }

    if (joinRequest.street_address === "333 chom st") {
      // wtf we're still here? bail!!!
      // TODO: Re-write this mock server because it SUUUUCKS
      return HttpResponse.json({ detail: "What the fuck" }, { status: 400 });
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
