import { add } from "..";

describe("computed", () => {
    it("index", () => {
      expect(add(4, 5)).toBe(9);
    });
})