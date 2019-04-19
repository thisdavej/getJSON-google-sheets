const GETJSON_MAX = require("../getJSON-functions.gs").GETJSON_MAX;

const url = "__tests__/json/tanks.json";

describe("GETJSON_MAX tanks tests", () => {
  it("returns max water temperature from all tanks", () => {
    const field = "watertemp.value";
    const result = GETJSON_MAX(url, field);

    const expected = ["72.74"];
    expect(result).toEqual(expected);
  });

  it("returns max water temperature from Tank2", () => {
    const field = "watertemp.value";
    const filterExpression = "x.Tank === 'Tank2'";
    const result = GETJSON_MAX(url, field, filterExpression);

    const expected = ["72.42"];
    expect(result).toEqual(expected);
  });
});
