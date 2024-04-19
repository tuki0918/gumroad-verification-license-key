import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Sample from "./Sample";

test("Sample", () => {
  render(<Sample />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
