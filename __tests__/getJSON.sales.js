const GETJSON = require("../getJSON-functions.gs").GETJSON;

let template = "{{sales[0].company}}";
const url = "__tests__/json/sales.json";

describe("GETJSON sales tests", () => {
  it("returns first sales record in each record", () => {
    const result = GETJSON(url, template);
    const expected = ["ACME", "Company A"];

    expect(result).toEqual(expected);
  });

  it("returns third sales record in each record or notFound if record missing", () => {
    template = "{{sales[2].company}}";
    const result = GETJSON(url, template);
    const expected = ["notFound", "Company C"];

    expect(result).toEqual(expected);
  });

  it("returns third sales record in each record or notFound if record missing", () => {
    template = "{{sales[2].company}}";
    const result = GETJSON(url, template);
    const expected = ["notFound", "Company C"];

    expect(result).toEqual(expected);
  });

  it("returns nested array results", () => {
    template = "{{sales[0].items[1]}}";
    const result = GETJSON(url, template);
    const expected = ["oranges", "celery"];

    expect(result).toEqual(expected);
  });

  it("returns nested sales company for multiple records", () => {
    template = "{{person.firstName}} || {{sales[0].company}}";
    const result = GETJSON(url, template);
    const expected = [
      ["Bob", "ACME"],
      ["Sally", "Company A"]
    ];

    expect(result).toEqual(expected);
  });

  it("returns nested sales company for multiple records (two companies)", () => {
    template =
      "{{person.firstName}} || {{sales[0].company}} || {{sales[1].company}}";
    const result = GETJSON(url, template);
    const expected = [
      ["Bob", "ACME", "Random Corp"],
      ["Sally", "Company A", "Company B"]
    ];

    expect(result).toEqual(expected);
  });
});
