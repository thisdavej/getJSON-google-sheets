const fs = require("fs");

module.exports.fetch = url => {
  return {
    getContentText: () => {
      const filePath = "./" + url;
      return fs.readFileSync(filePath, { encoding: "utf-8" });
    }
  };
};
