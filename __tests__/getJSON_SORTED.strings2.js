const GETJSON_SORTED = require("../getJSON-functions.gs").GETJSON_SORTED;

const template = "{{phrase}}";
const url = "__tests__/json/strings2.json";

describe("GETJSON_SORTED string2 tests", () => {
  it("returns strings sorted alphabetically", () => {
    const sortFields = "phrase";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["hello", "the", "to", "world"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted reverse alphabetically", () => {
    const sortFields = "-phrase";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["world", "to", "the", "hello"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted by string length (shortest to longest)", () => {
    const sortFields = "phrase|stringLength";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["to", "the", "hello", "world"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted by string length (longest to shortest)", () => {
    const sortFields = "-phrase|stringLength";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["hello", "world", "the", "to"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted by string length (shortest to longest) with secondary reverse alphabetic sort", () => {
    const sortFields = "phrase|stringLength,-phrase";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["to", "the", "world", "hello"];
    expect(result).toEqual(expected);
  });
});
