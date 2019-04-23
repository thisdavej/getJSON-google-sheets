# getJSON-google-sheets

Functions to fetch, filter, and sort JSON Web APIs in Google Sheets and render the results using a simple and powerful string template.

The `GetJSON-functions.gs` file adds a `=GETJSON()` function and other functions to your spreadsheet, and you're off and running!  See [Fetching, Filtering, and Sorting JSON APIs in Google Sheets: The Missing Functions](https://thisdavej.com/fetching-filtering-and-sorting-json-apis-in-google-sheets-the-missing-functions/) for the full documentation or continue reading for a high level jump-start.

## Installation

To get started:

- Launch Google Sheets and create a new spreadsheet.
- Go to `Tools` > `Script editor`
- Copy and paste the code from the `getJSON-functions.gs` file into the `Code.gs` file. (Or choose `File` > `New` > `Script file` to create a separate .gs file and paste it there.)
- Return to the Google sheet you created and type `=GETJSON` in a cell to start using the functions.

## Documentation

The `GetJSON-functions.gs` file includes the following functions:

| Function           | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| **GETJSON**        | Retrieve JSON from a Web API and render the results using a template                 |
| **GETJSON_SORTED** | Retrieve JSON from a Web API and sort and render the results using a template        |
| **GETJSON_MAX**    | Retrieve JSON from a Web API and return the maximum value for a given JSON attribute |
| **GETJSON_MIN**    | Retrieve JSON from a Web API and return the minimum value for a given JSON attribute |

## GETJSON

The `GETJSON` function is used as follows (parameters in square brackets are optional):

=GETJSON(url, template, [takeNum], [filterExpression])

Parameters

- `url` - The Web API URL containing the JSON object or array of objects to process
- `template` - The string template for rendering results. Use "\{\{Field1\}\}" to retrieve the value associated with a JSON attribute called "Field1". Use || to split the result into multiple spreadsheet columns.
- `takeNum` - The number of sorted results to return. Use -1 to return all rows.
- `filterExpression` - The filter expression to apply on the array of JSON objects before returning the results. Objects that evaluate to true are returned. Objects are referenced as "x" in the expression. For example: x.Title === 'VP' (This will return true if the Object in the JSON array being filtered has an attribute named "Title" with a value of "VP".)

To save frustration, the JSON object attributes supplied in `template` and `filterExpression` are not case sensitive.

### Example: Return the timestamp of the current ISS location

The Web API for retrieving the position of the ISS (<http://api.open-notify.org/iss-now.json>) returns results in the following JSON format:

```json
{
  "timestamp": 1554485189,
  "iss_position": { "longitude": "-129.7349", "latitude": "-36.4637" },
  "message": "success"
}
```

We use a template value of `{{timestamp}}` to dynamically substitute the `timestamp` attribute from the JSON object retrieved.

Spreadsheet input:

|     |        A         |                    B                    |
| :-- | :--------------: | :-------------------------------------: |
| 1   |       url        | http://api.open-notify.org/iss-now.json |
| 2   |     template     |              {{timestamp}}              |
| 3   |                  |                                         |
| 4   | =GETJSON(B1, B2) |                                         |

Spreadsheet result:

|     |     A      |                    B                    |
| :-- | :--------: | :-------------------------------------: |
| 1   |    url     | http://api.open-notify.org/iss-now.json |
| 2   |  template  |              {{timestamp}}              |
| 3   |            |                                         |
| 4   | 1554485189 |                                         |

### Example: Return the latitude and longitude of the current ISS location in separate columns of the spreadsheet

In this example, we use a template of "{{iss_position.latitude}} deg || {{iss_position.longitude}} deg" to dynamically substitute the longitude of the ISS followed by the units of "deg" that we added ourselves. The "||" is used as a column separator to split the returned results into separate columns.

We return nested JSON properties (e.g. `{{iss_position.latitude}}`) using a dot notation.

Spreadsheet input:

|     |        A         |                                 B                                 |
| :-- | :--------------: | :---------------------------------------------------------------: |
| 1   |       url        |              http://api.open-notify.org/iss-now.json              |
| 2   |     template     | {{iss_position.latitude}} deg \|\| {{iss_position.longitude}} deg |
| 3   |                  |                                                                   |
| 4   |     Latitude     |                             Longitude                             |
| 5   | =GETJSON(B1, B2) |                                                                   |

Spreadsheet result:

|     |      A       |                    B                    |
| :-- | :----------: | :-------------------------------------: |
| 1   |     url      | http://api.open-notify.org/iss-now.json |
| 2   |   template   |              {{timestamp}}              |
| 3   |              |                                         |
| 4   |   Latitude   |                Longitude                |
| 5   | -36.4637 deg |              -129.7349 deg              |

### Example: Retrieve Nested JSON Properties (Fish Tank IoT Data)

The Web API for retrieving the temperature of fish tanks (<http://thisdavej.com/api/tanks.php)> returns results in the following JSON format:

```json
[
  {
    "Tank": "Tank1",
    "watertemp": {
      "time": "2019-04-06 16:05 GMT",
      "value": 72.84
    }
  },
  {
    "Tank": "Tank2",
    "watertemp": {
      "time": "2019-04-06 16:05 GMT",
      "value": 72.39
    }
  },
  {
    "Tank": "Tank1",
    "watertemp": {
      "time": "2019-04-06 16:04 GMT",
      "value": 72.7
    }
  },
  {
    "Tank": "Tank2",
    "watertemp": {
      "time": "2019-04-06 16:04 GMT",
      "value": 72.81
    }
  }
]
```

We are seeking to return the tank name, water temperature timestamp, and water temperature value, separated in three columns in the spreadsheet. We can return nested JSON properties using a dot notation. For example: {{watertemp.value}}

Spreadsheet input:

|     |        A         |                             B                             | C         |
| :-- | :--------------: | :-------------------------------------------------------: | :-------- |
| 1   |       url        |            http://thisdavej.com/api/tanks.php             |           |
| 2   |     template     | {{Tank}} \|\| {{watertemp.time}} \|\| {{watertemp.value}} |           |
| 3   |                  |                                                           |           |
| 4   |       Tank       |                           Time                            | Temp (°F) |
| 5   | =GETJSON(B1, B2) |                                                           |

Spreadsheet result:

|     |    A     |                 B                  | C         |
| :-- | :------: | :--------------------------------: | :-------- |
| 1   |   url    | http://thisdavej.com/api/tanks.php |           |
| 2   | template |           {{timestamp}}            |           |
| 3   |          |                                    |           |
| 4   |   Tank   |                Time                | Temp (°F) |
| 5   |  Tank1   |        2019-04-06 16:05 GMT        | 72.84     |
| 6   |  Tank2   |        2019-04-06 16:05 GMT        | 72.39     |
| 7   |  Tank1   |        2019-04-06 16:04 GMT        | 72.7      |
| 8   |  Tank2   |        2019-04-06 16:04 GMT        | 72.81     |

## GETJSON_SORTED

The `GETJSON_SORTED` function is used as follows (parameters in square brackets are optional):

=GETJSON_SORTED(url, template, sortFields, [takeNum], [filterExpression])

The parameters include:

- `url` - The Web API URL containing the JSON object or array of objects to process
- `template` - The string template for rendering results. Use "\{\{Field1\}\}" to retrieve the value associated with a JSON attribute called "Field1". Use || to split the result into multiple spreadsheet columns.
- `sortFields` - The name of the JSON field or fields (attributes) to use for sorting. Multiple sort fields can be included, separated by commas inside one string. Use a minus sign in front of the JSON field to sort in descending order. Use "|" followed by a function to specify a function to be called on each field prior to making comparisons. For example, enter "watertemp.time|dateConvert" and create a "dateConvert" function to convert strings to date to sort by date. In our tanks example, the dates will sort correctly alphabetically so this example is somewhat contrived. The "|function" part of the syntax is optional.
- `takeNum` - The number of sorted results to return. Use -1 to return all rows.
- `filterExpression` - The filter expression to apply on the array of JSON objects before returning the results. Objects that evaluate to true are returned. Objects are referenced as "x" in the expression. For example: x.Title === 'VP' (This will return true if the Object in the JSON array being filtered has an attribute named "Title" with a value of "VP".)

### Example: Sort by Fish Tank Water Temperature

We sort the water temperature in ascending order using a `sortFields` value of "watertemp.value".

Note: To sort water temperature in descending order (largest values first), we would use a `sortFields` value of -"-watertemp.value". The "-" in front of the sort field produces a descending sort.

Spreadsheet input:

|     |             A             |                             B                             | C         |
| :-- | :-----------------------: | :-------------------------------------------------------: | :-------- |
| 1   |            url            |            http://thisdavej.com/api/tanks.php             |           |
| 2   |         template          | {{Tank}} \|\| {{watertemp.time}} \|\| {{watertemp.value}} |           |
| 3   |        sort field         |                      watertemp.value                      |           |
| 3   |                           |                                                           |           |
| 4   |           Tank            |                           Time                            | Temp (°F) |
| 5   | =GETJSON_SORTED(B1,B2,B3) |                                                           |

Spreadsheet result:

|     |    A     |                 B                  | C         |
| :-- | :------: | :--------------------------------: | :-------- |
| 1   |   url    | http://thisdavej.com/api/tanks.php |           |
| 2   | template |           {{timestamp}}            |           |
| 3   |          |                                    |           |
| 4   |   Tank   |                Time                | Temp (°F) |
| 6   |  Tank2   |        2019-04-06 16:05 GMT        | 72.39     |
| 7   |  Tank1   |        2019-04-06 16:04 GMT        | 72.7      |
| 8   |  Tank2   |        2019-04-06 16:04 GMT        | 72.81     |
| 9   |  Tank1   |        2019-04-06 16:05 GMT        | 72.84     |

## GETJSON_MAX

Usage

=GETJSON_MAX(url, field, [filterExpression], [primer])

The parameters include:

- `url` - The Web API URL containing the JSON object or array of objects to process
- `field` - The name of the JSON field to use as a basis for the maximum value
- `filterExpression` - The filter expression to apply on the array of JSON objects before determining the maximum value. Objects are referenced as "x" in the expression. For example: x.Tank === 'Tank1' (This will return true if the Object in the JSON array being filtered has an attribute named "Tank" with a value of "Tank1".)
- `primer` - The function to call on each field prior to making comparisons. For example, create a function called "dateConvert" to convert strings to dates and enter "dateConvert" as the primer. In our tanks example, the dates will sort correctly alphabetically so this example is somewhat contrived. It is not necessary to use the built-in JavaScript "parseFloat" function for sorting floating point numbers since JavaScript will infer the values as floats.

## GETJSON_MIN

Usage

=GETJSON_MIN(url, field, [filterExpression], [primer])

The parameters include:

- `url` - The Web API URL containing the JSON object or array of objects to process
- `field` - The name of the JSON field to use as a basis for the minimum value
- `filterExpression` - The filter expression to apply on the array of JSON objects before determining the minimum value. Objects are referenced as "x" in the expression. For example: x.Tank === 'Tank1' (This will return true if the Object in the JSON array being filtered has an attribute named "Tank" with a value of "Tank1".)
- `primer` - The function to call on each field prior to making comparisons. For example, create a function called "dateConvert" to convert strings to dates and enter "dateConvert" as the primer. In our tanks example, the dates will sort correctly alphabetically so this example is somewhat contrived. It is not necessary to use the built-in JavaScript "parseFloat" function for sorting floating point numbers since JavaScript will infer the values as floats.

### Additional Documentation and Examples

Please see [Fetching, Filtering, and Sorting JSON APIs in Google Sheets: The Missing Functions](https://thisdavej.com/fetching-filtering-and-sorting-json-apis-in-google-sheets-the-missing-functions/) for the full documentation and additional examples.

## License

MIT © [Dave Johnson (thisDaveJ)](https://thisdavej.com)
