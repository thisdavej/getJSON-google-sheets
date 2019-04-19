const GETJSON_MIN = require("../getJSON-functions.gs").GETJSON_MIN;

const url = "__tests__/json/tanks.json";

describe("GETJSON_MAX tanks tests", () => {
  it("returns min water temperature from all tanks", () => {
    const field = "watertemp.value";
    const result = GETJSON_MIN(url, field);

    const expected = ["72.04"];
    expect(result).toEqual(expected);
  });

  it("returns min water temperature from Tank2", () => {
    const field = "watertemp.value";
    const filterExpression = "x.Tank === 'Tank2'";
    const result = GETJSON_MIN(url, field, filterExpression);

    const expected = ["72.17"];
    expect(result).toEqual(expected);
  });
});
