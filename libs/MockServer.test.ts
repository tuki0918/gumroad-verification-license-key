import { testResponseMock } from "@/mocks/mocks";
import { server } from "@/mocks/node";
import { http, HttpResponse } from "msw";

describe("MockServer", () => {
  it("should return a valid testResponseMock when request successful", async () => {
    const endpoint = "https://example.com/test";
    const res = await fetch(endpoint, {
      // method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      // }),
    });
    const response = await res.json();
    expect(response).toStrictEqual(testResponseMock);
  });

  it("should return a valid testResponseMock when request successful - mock override", async () => {
    const testResponseMock2 = {
      ...testResponseMock,
      message: "Test response mock override",
    } satisfies typeof testResponseMock;

    server.use(
      http.get("https://example.com/test", () => {
        return HttpResponse.json(testResponseMock2);
      }),
    );

    const endpoint = "https://example.com/test";
    const res = await fetch(endpoint, {
      // method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      // }),
    });
    const response = await res.json();
    expect(response).toStrictEqual(testResponseMock2);
  });
});
