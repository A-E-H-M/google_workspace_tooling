function myFunction() {
  
  const ssId = "YOUR_GOOGLE_SPREADSHEET_ID";
  const tableId_1 = "YOUR_TABLE_ID";

  const request_1 = "YOUR_KEY";

  var allSheets = Sheets.Spreadsheets.get(ssId, { 'fields': request_1});
  var json = allSheets.sheets[1].tables[0].tableId;
  Logger.log(allSheets.sheets.length);

  Logger.log(json);

  const request = [
    {
      "updateTable": {
        "table": {
          "tableId": tableId_1,
          "name": "YOUR_NEW_TABLE_NAME"
        },
        "fields": "name"
      }
    }
  ];

  Sheets.Spreadsheets.batchUpdate(body={ 'requests': request }, ssId);

}