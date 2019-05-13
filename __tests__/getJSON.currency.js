const GETJSON = require("../getJSON-functions.gs").GETJSON;

const url = "__tests__/json/currency.json";

describe("Currency JSON tests", () => {
  it("returns exchange rate", () => {
    const template = '{{Realtime Currency Exchange Rate."5. Exchange Rate"}}';
    const result = GETJSON(url, template);
    const expected = ["109.22000000"];
    expect(result).toEqual(expected);
  });

  it("returns bid price", () => {
    const template = "{{Realtime Currency Exchange Rate.8_Bid Price}}";
    const result = GETJSON(url, template);
    const expected = ["109.21000000"];
    expect(result).toEqual(expected);
  });

  it("returns bid price (case insensitive)", () => {
    const template = "{{Realtime Currency Exchange Rate.8_BID PRICE}}";
    const result = GETJSON(url, template);
    const expected = ["109.21000000"];
    expect(result).toEqual(expected);
  });

  it("returns ask price (no dots or spaces in attribute)", () => {
    const template = "{{Realtime Currency Exchange Rate.9_Ask_Price}}";
    const result = GETJSON(url, template);
    const expected = ["109.24000000"];
    expect(result).toEqual(expected);
  });
});
