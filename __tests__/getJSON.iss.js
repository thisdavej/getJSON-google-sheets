const GETJSON = require("../getJSON-functions.gs").GETJSON;

const url = "__tests__/json/iss.json";

describe("ISS JSON tests", () => {
  it("returns ISS timestamp", () => {
    const template = "{{timestamp}}";
    const result = GETJSON(url, template);
    const expected = ["1555344069"];
    expect(result).toEqual(expected);
  });

  it("returns latitude with 'deg' as part of template", () => {
    const template = "{{iss_position.latitude}} deg";
    const result = GETJSON(url, template);
    const expected = ["48.4686 deg"];
    expect(result).toEqual(expected);
  });

  it("returns latitude and longitude separated by columns", () => {
    const template =
      "{{iss_position.latitude}} deg || {{iss_position.longitude}} deg";
    const result = GETJSON(url, template);
    const expected = [["48.4686 deg", "-15.2294 deg"]];
    expect(result).toEqual(expected);
  });
});
