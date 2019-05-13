/**
 * @file Google Sheets functions to fetch, filter, and sort JSON data from Web APIs.
 * GitHub URL: https://github.com/thisdavej/getJSON-google-sheets
 * @author Dave Johnson (https://thisdavej.com/)
 */

function JSONtoObject(url) {
  var url = encodeURI(url);
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();

  // convert keys to lower case so case insensitive
  json = json.replace(/"([^"]+)":/g, function($0, $1) {
    return '"' + $1.toLowerCase() + '":';
  });
  var obj = JSON.parse(json);

  if (!Array.isArray(obj)) {
    obj = [obj];
  }
  return obj;
}

function filterObject(obj, filterExpression) {
  var obj = obj;
  if (filterExpression != undefined) {
    // make x.Tank lower case to x.tank (or other keys)
    filterExpression = filterExpression.replace(/(x.[\w.]+)/g, function(
      $0,
      $1
    ) {
      return $1.toLowerCase();
    });
    eval("var dynamicFilter = function(x) { return " + filterExpression + " }");
    obj = obj.filter(dynamicFilter);
  }
  return obj;
}


function removeDoubleQuotes(s) {
  return s.replace(/(^"|"$)/g, '')
}


// Allows us to get values associated with JSON attributes such as "Field1" and nested attributes
// such as "watertemp.time"
function getJsonValue(path, obj) {
  var NOT_FOUND = "notFound";
  var parts = path.split(/(?!\B"[^"]*)\.(?![^"]*"\B)/);
  var part;
  var last = removeDoubleQuotes(parts.pop());
  while ((part = parts.shift())) {
    part = removeDoubleQuotes(part);
    if (typeof obj[part] != "object") return NOT_FOUND;
    obj = obj[part];
  }

  var r = obj[last];
  return r === undefined ? NOT_FOUND : r;
}

// Substitute {{Field1}}, for example, with the value associated with "Field1"
// in the JSON object.
var mapRows = function(template) {
  return function(row) {
    var result = template.replace(/\{\{\s*(.*?)\s*\}\}/g, function(
      match,
      varName
    ) {
      // make varName lower case so keys are case insensitive
      varName = varName.toLowerCase();
      return getJsonValue(varName, row);
    });

    var items = result.split(/\s*\|\|\s*/);
    return items.length == 1 ? items[0] : items;
  };
};

/**
 * Retrieve JSON from a Web API and render the results using a string template.
 *
 * @param {"https://thisdavej.com/api/tanks.php"} url
 *        The Web API URL containing the JSON object or array of objects to process
 * @param {"{{Tank}} || {{watertemp.time}} || {{watertemp.value}}"} template
 *        The string template for rendering results. Use {{Field1}} to retrieve the value associated
 *        with a JSON attribute called "Field1".  Use || to split the result into multiple spreadsheet
 *        columns.
 * @param {"-1"} takeNum
 *       The number of sorted results to return. Use -1 to return all rows.
 * @param {"x.Tank === 'Tank1'"} filterExpression
 *        The filter expression to apply on the array of JSON objects before returning the results.
 *        Objects that evaluate to true are returned. Objects are referenced as "x" in the expression.
 *        For example: x.Title === 'VP' (This will return true if the Object in the JSON array being
 *        filtered has an attribute named "Title" with a value of "VP".)
 * @customfunction
 */
function GETJSON(url, template, takeNum, filterExpression) {
  var obj = JSONtoObject(url);
  obj = filterObject(obj, filterExpression);
  if (takeNum > 0) obj = obj.slice(0, takeNum);
  return obj.map(mapRows(template));
}

/**
 * Retrieve JSON from a Web API and sort and render the results using a string template.
 *
 * @param {"https://thisdavej.com/api/tanks.php"} url
 *        The Web API URL containing the JSON object or array of objects to process
 * @param {"{{Tank}} || {{watertemp.time}} || {{watertemp.value}}"} template
 *        The string template for rendering results. Use {{Field1}} to retrieve the value associated
 *        with a JSON attribute called "Field1".  Use || to split the result into multiple spreadsheet
 *        columns.
 * @param {"watertemp.value|parseFloat"} sortFields
 *        The name of the JSON field or fields (attributes) to use for sorting. Multiple sort fields
 *        can be included, separated by commas inside one string. Use a minus sign in front of the JSON
 *        field to sort in descending order.  Use "|" followed by a function to specify a function to be
 *        called on each field prior to making comparisons.  For example, enter "watertemp.time|dateConvert"
 *        and create a "dateConvert" function to convert strings to date to sort by date. In our tanks
 *        example, the dates will sort correctly alphabetically so this example is somewhat contrived.
 * @param {"-1"} takeNum
 *       The number of sorted results to return. Use -1 to return all rows.
 * @param {"x.Tank === 'Tank1'"} filterExpression
 *        The filter expression to apply on the array of JSON objects before returning the results. Objects
 *        that evaluate to true are returned. Objects are referenced as "x" in the expression. For
 *        example: x.Tank === 'Tank1' (This will return true if the Object in the JSON array being filtered
 *        has an attribute named "Tank" with a value of "Tank1".)
 * @customfunction
 */
function GETJSON_SORTED(url, template, sortFields, takeNum, filterExpression) {
  var resolve_field = function(x, field) {
    var parts = field.split(".");
    var part = parts.shift();
    var obj = x[part];
    while ((part = parts.shift())) {
      if (obj[part] === undefined) return undefined;
      obj = obj[part];
    }
    return obj;
  };

  function dynamicSort(sField) {
    var parts = sField.split(/\s*\|\s*/);
    var sPrimer;
    if (parts.length > 1) sPrimer = parts[1];

    var primer = eval(sPrimer);

    field = parts[0];

    if (field[0] === "-") {
      reverse = true;
      field = field.substr(1);
    } else {
      reverse = false;
    }

    var key = primer
      ? function(x) {
          return primer(resolve_field(x, field));
        }
      : function(x) {
          return resolve_field(x, field);
        };
    reverse = !reverse ? 1 : -1;
    return function(a, b) {
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  }

  // Leveraged from https://stackoverflow.com/a/4760279
  function dynamicSortMultiple(fields) {
    var props = fields.split(/\s*,\s*/);
    return function(obj1, obj2) {
      var i = 0,
        result = 0,
        numberOfProperties = props.length;
      while (result === 0 && i < numberOfProperties) {
        result = dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    };
  }

  var obj = JSONtoObject(url);
  obj = filterObject(obj, filterExpression);

  if (sortFields != undefined) {
    obj.sort(dynamicSortMultiple(sortFields));
  }

  if (takeNum > 0) obj = obj.slice(0, takeNum);
  obj = obj.map(mapRows(template));
  return obj;
}

function _minMaxCore(url, field, filterExpression, primer, maximize) {
  var sortOrder = maximize === true ? "-" : "";
  var template = "{{" + field + "}}";
  var sPrimer = primer !== undefined ? "|" + primer : "";
  var sortFields = sortOrder + field + sPrimer;
  return GETJSON_SORTED(url, template, sortFields, 1, filterExpression);
}

/**
 * Retrieve JSON from a Web API and return the maximum value for a given JSON attribute.
 *
 * @param {"https://thisdavej.com/api/tanks.php"} url
 *        The Web API URL containing the JSON object or array of objects to process
 * @param {"watertemp.value"} field
 *        The name of the JSON field to use as a basis for the maximum value
 * @param {"x.Tank === 'Tank1'"} filterExpression
 *        The filter expression to apply on the array of JSON objects before determining the
 *        maximum value. Objects are referenced as "x" in the expression. For example: x.Tank === 'Tank1'
 *        (This will return true if the Object in the JSON array being filtered has an attribute
 *        named "Tank" with a value of "Tank1".)
 * @param {"parseFloat"} primer
 *        The function to call on each field prior to making comparisons.  For example, create a function
 *        called "dateConvert" to convert strings to dates and enter "dateConvert" as the primer.
 *        In our tanks example, the dates will sort correctly alphabetically so this example is somewhat
 *        contrived.  It is not necessary to use the built-in JavaScript "parseFloat" function for
 *        sorting floating point numbers since JavaScript will infer the values as floats.
 * @customfunction
 */
function GETJSON_MAX(url, field, filterExpression, primer) {
  return _minMaxCore(url, field, filterExpression, primer, true);
}

/**
 * Retrieve JSON from a Web API and return the minimum value for a given JSON attribute.
 *
 * @param {"https://thisdavej.com/api/tanks.php"} url
 *        The Web API URL containing the JSON object or array of objects to process
 * @param {"watertemp.value"} field
 *        The name of the JSON field to use as a basis for the minimum value
 * @param {"x.Tank === 'Tank1'"} filterExpression
 *        The filter expression to apply on the array of JSON objects before determining the
 *        minimum value. Objects are referenced as "x" in the expression. For example: x.Tank === 'Tank1'
 *        (This will return true if the Object in the JSON array being filtered has an attribute
 *        named "Tank" with a value of "Tank1".)
 * @param {"parseFloat"} primer
 *        The function to call on each field prior to making comparisons.  For example, create a function
 *        called "dateConvert" to convert strings to dates and enter "dateConvert" as the primer.
 *        In our tanks example, the dates will sort correctly alphabetically so this example is somewhat
 *        contrived.  It is not necessary to use the built-in JavaScript "parseFloat" function for
 *        sorting floating point numbers since JavaScript will infer the values as floats.
 * @customfunction
 */
function GETJSON_MIN(url, field, filterExpression, primer) {
  return _minMaxCore(url, field, filterExpression, primer, false);
}

/**
 * Start of testing code
 * Un-comment the following lines to test outside of Google sheets using npm run test
 */

// const UrlFetchApp = require("./__tests__/ignore/UrlFetchApp");
// module.exports.GETJSON = GETJSON;
// module.exports.GETJSON_SORTED = GETJSON_SORTED;
// module.exports.GETJSON_MIN = GETJSON_MIN;
// module.exports.GETJSON_MAX = GETJSON_MAX;

// // used for testing primer with sort function
// function stringLength(s) {
//   return s.length;
// }

/**
 * End of testing code
 */
