const GETJSON = require("../getJSON-functions.gs").GETJSON;

const template = "{{Tank}} || {{watertemp.time}} || {{watertemp.value}}";
const url = "__tests__/json/tanks.json";

describe("GETJSON tanks tests", () => {
  it("returns all tank records", () => {
    const result = GETJSON(url, template);

    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank2", "2019-04-04 17:06 GMT", "72.17"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"],
      ["Tank2", "2019-04-04 17:05 GMT", "72.18"],
      ["Tank1", "2019-04-04 17:04 GMT", "72.04"],
      ["Tank2", "2019-04-04 17:04 GMT", "72.42"]
    ];

    expect(result).toEqual(expected);
  });

  it("returns first 2 records", () => {
    const result = GETJSON(url, template, 2);

    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank2", "2019-04-04 17:06 GMT", "72.17"]
    ];

    expect(result).toEqual(expected);
  });

  it("returns all tank records equal to 'Tank1'", () => {
    const filterExpression = "x.Tank === 'Tank1'";
    const result = GETJSON(url, template, -1, filterExpression);
    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"],
      ["Tank1", "2019-04-04 17:04 GMT", "72.04"]
    ];

    expect(result).toEqual(expected);
  });

  it("returns first 2 tank records equal to 'Tank1'", () => {
    const filterExpression = "x.Tank === 'Tank1'";
    const result = GETJSON(url, template, 2, filterExpression);
    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"]
    ];

    expect(result).toEqual(expected);
  });

  it("returns all tank records equal to 'Tank1' and water temp > threshold", () => {
    const filterExpression = "x.Tank === 'Tank1' && x.watertemp.value > 72.5";
    const result = GETJSON(url, template, -1, filterExpression);
    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"]
    ];
    expect(result).toEqual(expected);
  });

  it("returns first tank record equal to 'Tank1' and water temp > threshold", () => {
    const filterExpression = "x.Tank === 'Tank1' && x.watertemp.value > 72.5";
    const result = GETJSON(url, template, 1, filterExpression);
    const expected = [["Tank1", "2019-04-04 17:06 GMT", "72.74"]];
    expect(result).toEqual(expected);
  });
});
