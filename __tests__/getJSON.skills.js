const GETJSON = require("../getJSON-functions.gs").GETJSON;

const url = "__tests__/json/skills.json";

describe("GETJSON skills tests", () => {
  it("returns nested sales company for multiple records (two companies)", () => {
    template = "{{name}} || {{skills[0].name}} || {{skills[1].name}}";
    const result = GETJSON(url, template);
    const expected = [
      ["Bob", "Negotiation", "Sales"],
      ["Sally", "Marketing", "Sales"]
    ];

    expect(result).toEqual(expected);
  });
});
