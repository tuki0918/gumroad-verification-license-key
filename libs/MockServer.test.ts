import { testResponseMock } from "../mocks/mocks";

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
});
