const GETJSON_SORTED = require("../getJSON-functions.gs").GETJSON_SORTED;

const template = "{{phrase}}";
const url = "__tests__/json/strings.json";

describe("GETJSON_SORTED string tests", () => {
  it("returns strings sorted alphabetically", () => {
    const sortFields = "phrase";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["The quick", "brown fox jumps over", "the lazy dog"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted alphabetically (case insensitive sortFields)", () => {
    const sortFields = "PHRASe";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["The quick", "brown fox jumps over", "the lazy dog"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted alphabetically (case insensitive template)", () => {
    const sortFields = "phrase";
    const template_mixed_case = "{{PHRAse}}";
    const result = GETJSON_SORTED(url, template_mixed_case, sortFields);

    const expected = ["The quick", "brown fox jumps over", "the lazy dog"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted alphabetically (case insensitive sortFields and template)", () => {
    const sortFields = "PHRase";
    const template_mixed_case = "{{PHRAse}}";
    const result = GETJSON_SORTED(url, template_mixed_case, sortFields);

    const expected = ["The quick", "brown fox jumps over", "the lazy dog"];
    expect(result).toEqual(expected);
  });

  it("returns notFound elements for invalid template", () => {
    const sortFields = "phrase";
    const template_bogus = "{{invalid_field}}";
    const result = GETJSON_SORTED(url, template_bogus, sortFields);

    const expected = ["notFound", "notFound", "notFound"];
    expect(result).toEqual(expected);
  });

  it("returns unsorted array if invalid sort field", () => {
    const sortFields = "invalid_field";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["The quick", "brown fox jumps over", "the lazy dog"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted reverse alphabetically", () => {
    const sortFields = "-phrase";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["the lazy dog", "brown fox jumps over", "The quick"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted by string length (shortest to longest)", () => {
    const sortFields = "phrase|stringLength";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["The quick", "the lazy dog", "brown fox jumps over"];
    expect(result).toEqual(expected);
  });

  it("returns strings sorted by string length (longest to shortest)", () => {
    const sortFields = "-phrase|stringLength";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = ["brown fox jumps over", "the lazy dog", "The quick"];
    expect(result).toEqual(expected);
  });
});
