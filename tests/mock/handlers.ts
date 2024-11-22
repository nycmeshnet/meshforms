import { http, HttpResponse } from "msw";
import { expectedAPIRequestData, triggerCapchaV2Response } from "../util";
import { isDeepStrictEqual } from "util";
import {
  JoinFormResponse,
  JoinFormValues,
} from "@/components/JoinForm/JoinForm";
import { NNAssignRequestValues } from "@/components/NNAssignForm/NNAssignForm";

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

    const good_response: JoinFormResponse = {
      detail: "",
      building_id: "a5b316f2-c167-40a1-8f40-dd6b54daf0fe",
      member_id: "c9305944-80d8-4b1c-b5b9-3c9c0db0d2a1",
      install_id: "d9e13697-8240-4c0c-be86-d9aa67617165",
      install_number: 1002,
      member_exists: false,
      changed_info: {},
    };

    // Special case to test "trust me bro"
    if (joinRequest.street_address === "333 chom st") {
      if (joinRequest.trust_me_bro) {
        return HttpResponse.json(good_response, { status: 201 });
      }

      // Else, we're gonna return a 409.
      let r = new JoinFormResponse();
      r.detail = "Mock: Please confirm a few details.";
      r.changed_info = { street_address: "333 Chom Street" };

      return HttpResponse.json(r, { status: 409 });
    }

    if (!joinRequest.trust_me_bro) {
      // Bail on New Jersey
      if (joinRequest.state === "NJ" || joinRequest.state === "New Jersey") {
        let r = new JoinFormResponse();
        r.detail =
          "Mock: Non-NYC registrations are not supported at this time.";

        return HttpResponse.json(r, { status: 400 });
      }

      // Return 409 if the street address is improperly formatted
      if (joinRequest.street_address === "197 prospect pl") {
        let r = new JoinFormResponse();
        r.detail = "Mock: Please confirm a few details.";
        r.changed_info = { street_address: "197 Prospect Place" };

        return HttpResponse.json(r, { status: 409 });
      }

      // Return 409 if the city is improperly formatted
      if (joinRequest.city === "brooklyn") {
        let r = new JoinFormResponse();
        r.detail = "Mock: Please confirm a few details.";
        r.changed_info = { city: "Brooklyn" };
        return HttpResponse.json(r, { status: 409 });
      }

      // Mock response for if we want to trigger a capchaV2 response
      if (request.headers.get("X-Recaptcha-V2-Token") === "") {
      //if (joinRequest.referral === triggerCapchaV2Response) {
        return HttpResponse.json({"detail": "Captcha verification failed"}, { status: 401 });
      }

      // If anything else is wrong with the form we got, then bail
      if (!isDeepStrictEqual(joinRequest, expectedAPIRequestData)) {
        console.error(
          "Mock Join API is returning 400. (request is not deeply equal to expectedAPIRequestData)",
        );
        console.error("Expected the following:");
        console.error(expectedAPIRequestData);
        console.error("Got the follwing:");
        console.error(joinRequest);

        let r = new JoinFormResponse();
        r.detail = "Mock failure. Request does not match expected request.";
        return HttpResponse.json(r, { status: 400 });
      }
    }

    if (joinRequest.street_address === "333 chom st") {
      // wtf we're still here? bail!!!
      // TODO: Re-write this mock server because it SUUUUCKS
      let r = new JoinFormResponse();
      r.detail = "What the fuck";
      return HttpResponse.json(r, { status: 400 });
    }

    // OK we're chilling. Return 200
    return HttpResponse.json(good_response, { status: 201 });
  }),
  http.post("/api/v1/nn-assign/", async ({ request }) => {
    console.debug("Hello from mocked NN Assign API.");

    const requestJson = await request.json();

    if (requestJson === undefined || requestJson === null) {
      return HttpResponse.json(
        { detail: "Mock: Missing request body" },
        { status: 400 },
      );
    }

    const nnAssignRequest: NNAssignRequestValues =
      requestJson as NNAssignRequestValues;

    // Firstly, check if we have the right password
    if (nnAssignRequest.password != "localdev") {
      console.debug("Mock bad password");
      return HttpResponse.json(
        { detail: "Mock failure. Authentication Failed." },
        { status: 400 },
      );
    }

    if (nnAssignRequest.install_number == "20000") {
      const json = {
        detail: "Network Number has been assigned!",
        building_id: 69,
        install_id: 69,
        install_number: 20000,
        network_number: 420,
        created: true,
      };

      return HttpResponse.json(json, { status: 201 });
    }

    if (nnAssignRequest.install_number == "30000") {
      const message = `This Install Number (30000) already has a Network Number (520) associated with it!`;
      const json = {
        detail: message,
        building_id: 79,
        install_id: 79,
        install_number: 30000,
        network_number: 520,
        created: false,
      };
      return HttpResponse.json(json, { status: 200 });
    }

    return HttpResponse.json(
      { detail: "Mock failure. Server Error." },
      { status: 500 },
    );
  }),
];
