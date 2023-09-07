import { arrayRange, padLeadingZeros } from "./index";

test("arrayRange should generate an array", () => {
  const result = arrayRange(1, 10, 2);

  expect(result).toEqual([1, 3, 5, 7, 9]);
});

test("padLeadingZeros should add leading zeros", () => {
  const result = padLeadingZeros(7, 3);

  expect(result).toEqual("007");
});
