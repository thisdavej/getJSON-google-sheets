const GETJSON_SORTED = require("../getJSON-functions.gs").GETJSON_SORTED;

const template = "{{Tank}} || {{watertemp.time}} || {{watertemp.value}}";
const url = "__tests__/json/tanks.json";

describe("GETJSON_SORTED tanks tests", () => {
  it("returns all tank records sorted by water temp", () => {
    const sortFields = "watertemp.value";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = [
      ["Tank1", "2019-04-04 17:04 GMT", "72.04"],
      ["Tank2", "2019-04-04 17:06 GMT", "72.17"],
      ["Tank2", "2019-04-04 17:05 GMT", "72.18"],
      ["Tank2", "2019-04-04 17:04 GMT", "72.42"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"],
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"]
    ];
    expect(result).toEqual(expected);
  });

  it("returns all tank records sorted by water temp descending", () => {
    const sortFields = "-watertemp.value";
    const result = GETJSON_SORTED(url, template, sortFields);

    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"],
      ["Tank2", "2019-04-04 17:04 GMT", "72.42"],
      ["Tank2", "2019-04-04 17:05 GMT", "72.18"],
      ["Tank2", "2019-04-04 17:06 GMT", "72.17"],
      ["Tank1", "2019-04-04 17:04 GMT", "72.04"]
    ];
    expect(result).toEqual(expected);
  });

  it("returns first 3 tank records sorted by water temp", () => {
    const sortFields = "watertemp.value";
    const result = GETJSON_SORTED(url, template, sortFields, 3);

    const expected = [
      ["Tank1", "2019-04-04 17:04 GMT", "72.04"],
      ["Tank2", "2019-04-04 17:06 GMT", "72.17"],
      ["Tank2", "2019-04-04 17:05 GMT", "72.18"]
    ];
    expect(result).toEqual(expected);
  });

  it("returns first 3 tank records sorted by water temp descending for Tank1", () => {
    const sortFields = "-watertemp.value";
    const filterExpression = "x.Tank === 'Tank1'";
    const result = GETJSON_SORTED(
      url,
      template,
      sortFields,
      -1,
      filterExpression
    );

    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"],
      ["Tank1", "2019-04-04 17:04 GMT", "72.04"]
    ];
    expect(result).toEqual(expected);
  });

  it("returns first 2 tank records sorted by water temp descending for Tank1", () => {
    const sortFields = "-watertemp.value";
    const filterExpression = "x.Tank === 'Tank1'";
    const result = GETJSON_SORTED(
      url,
      template,
      sortFields,
      2,
      filterExpression
    );

    const expected = [
      ["Tank1", "2019-04-04 17:06 GMT", "72.74"],
      ["Tank1", "2019-04-04 17:05 GMT", "72.66"]
    ];
    expect(result).toEqual(expected);
  });
});
