function main () 
{
  // Hyperlink to test copy of parent spreadsheet
  const spreadsheet = 'YOUR_GOOGLE_SPREADSHEET_URL';

  updateSheet(spreadsheet);
}

function updateSheet(spreadsheet) 
{
  var sheets = SpreadsheetApp.openByUrl(spreadsheet).getSheets();

  // Loop to iterate through each sheet in the top level spreadsheet
  for (const sheet of sheets) {
    var sheetName = sheet.getName();

    if(!sheet.isSheetHidden() && sheetName != 'YOUR_SHEET_NAME') {
      Logger.log(sheetName);
      let numOfCells = sheet.getLastRow(); 
      var range = sheet.getRange(1, 1, numOfCells, 1).getValues();
      var name = '';
      
      for (var i = 1; i < numOfCells; ++i) {
        if (!sheet.isRowHiddenByUser(1)) {
          name = range[i][0];
          Logger.log(name);
          
          var ssId = DriveApp.getFilesByName(name).next().getId();
          Logger.log(ssId);
          var tempSheet = SpreadsheetApp.openById(ssId).getSheets()[0];
          
          //var tempSheet = ss.getSheetByName(name);
          var sheetLastRow = tempSheet.getLastRow();

          var noPhoto = 0;
          var photo = 0;

          var range2 = tempSheet.getDataRange().getValues();
          
          for (var a = 2; a < sheetLastRow; a++) {
            if (range2[a][12] == 'Y' || range2[a][11] == 'YOUR_VARIABLE' || range2[a][11] == 'YOUR_VARIABLE' || range2[a][11] == 'YOUR_VARIABLE') {
              noPhoto++;
            }
            else {
              photo++;
            }
          }
          sheet.getRange(i + 1, 2).setValue(sheetLastRow - 2);
          sheet.getRange(i + 1, 3).setValue(noPhoto);
          sheet.getRange(i + 1, 4).setValue(photo);

          var photosTaken = sheet.getRange(i + 1, 5).getValue();
          if (photosTaken > (sheetLastRow - 2) || photo == photosTaken) {
            sheet.getRange(i + 1, 9).setValue('DONE');
          }
          else {
            sheet.getRange(i + 1, 9).setValue('');
          }
        }
      }
    }
  }
}
