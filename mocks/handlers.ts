import { http, HttpResponse } from "msw";
import { testResponseMock } from "./mocks";

export const handlers = [
  http.get("https://example.com/test", () => {
    return HttpResponse.json(testResponseMock);
  }),
];
