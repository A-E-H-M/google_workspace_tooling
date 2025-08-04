function init() {
  // This hyperlink to the top-level spreadsheet that will be refered to when creating the folders
  const ssHyperlink1 = 'https://YOUR_URL';
  // Name of the sheet to be referenced
  const sheetName1 = 'YOUR_SHEET_NAME';
  // Hyperlink to output spreadsheet
  //const ssHyperlink2 = 'https://YOUR_URL';
  // Test spreadsheet
  const ssHyperlink2 = 'https://YOUR_URL';
  // Output spreadsheet
  const sheetName2 = 'YOUR_SHEET_NAME';
  // Optional: Use this if you are searching through multiple spreadsheets
  //const folderLocationId = 'YOUR_FOLDER_ID';

  // Runs script
  run(ssHyperlink1, sheetName1, ssHyperlink2, sheetName2)
}

function run(hyperLink1, sheet1, hyperLink2, sheet2) {

  // Variables
  //const googleSSFileType = MimeType.GOOGLE_SHEETS;
  let sheetName_1;

  let ss_1 = SpreadsheetApp.openByUrl(hyperLink1);
  let sheets_1 = ss_1.getSheets();

  let ss_2 = SpreadsheetApp.openByUrl(hyperLink2);
  let sheets_2 = ss_2.getSheets()[0];

  for (const sheet of sheets_1) {
    sheetName_1 = sheet.getName();
    if (sheetName_1 == sheet1 && !sheet.isSheetHidden()) {

      var tempSheet_1 = createTempSheet(sheet, ss_1);
      var lastRow = tempSheet_1.getLastRow();
      var row = tempSheet_1.getDataRange().getValues();

      ss_1.deleteSheet(tempSheet_1);

      let catalogNumberColumn = 1;
      let scientificNameColumn = [6, 7, 8];
      for (var i = 1; i < lastRow; ++i) {

        var rowRange = row[i + 1];

        var collCodeColumn = rowRange[3];

        let totalLengthColumn = rowRange[21];
        let totalLengthValue = rowRange[24];
        let totalLengthMUColumn = rowRange[23];


        let tailLengthColumn = rowRange[26];
        let tailLengthValue = rowRange[29];
        let tailLengthMUColumn = rowRange[28];


        let hindfootLengthColumn = rowRange[31];
        let hindfootLengthValue = rowRange[34];
        let hindfootLengthMUColumn = rowRange[33];


        let earLengthColumn = rowRange[36];
        let earLengthValue = rowRange[39];
        let earLengthMUColumn = rowRange[38];

        let order = rowRange[4];
        let family = rowRange[5];
        let genus = rowRange[6];

        let state_province = rowRange[9];
        let county = rowRange[6];
        let instituteCode = "YOUR_INSTITUTION_CODE";
        let updateSheet = false;

        let x = 0;
        let y = 0;
        let z = 0;

        let scientificName = getNewName(rowRange, scientificNameColumn);

        for (var a = 0; a < row.length; ++a) {
          switch (a) {
            case 22:
              updateSheet = true;
              x = totalLengthColumn;
              y = totalLengthValue;
              z = totalLengthMUColumn;
              break;
            case 27:
              updateSheet = true;
              x = tailLengthColumn;
              y = tailLengthValue;
              z = tailLengthMUColumn;
              break;
            case 32:
              updateSheet = true;
              x = hindfootLengthColumn;
              y = hindfootLengthValue;
              z = hindfootLengthMUColumn;
              break;
            case 37:
              updateSheet = true;
              x = earLengthColumn;
              y = earLengthValue;
              z = earLengthMUColumn;
              break;
          }

          if (updateSheet) {
            sheets_2.appendRow(['', rowRange[catalogNumberColumn], scientificName, '', instituteCode,
              x, y, z,
              collCodeColumn, order, family, genus, '', state_province, county
            ]);
            updateSheet = false;
          }
        }


        /*
        for (var a = 0; a < row.length; ++a) {
          switch (a) {
            case 22:
              sheets_2.appendRow(['', rowRange[catalogNumberColumn], scientificName, '', instituteCode,
                totalLengthColumn, totalLengthValue, totalLengthMUColumn,
                collCodeColumn, order, family, genus, '', state_province, county
              ]);
              break;
            case 27:
              sheets_2.appendRow(['', rowRange[catalogNumberColumn], scientificName, '', instituteCode,
                tailLengthColumn, tailLengthValue, tailLengthMUColumn,
                collCodeColumn, order, family, genus, '', state_province, county
              ]);
              break;
            case 32:
              sheets_2.appendRow(['', rowRange[catalogNumberColumn], scientificName, '', instituteCode,
                hindfootLengthColumn, hindfootLengthValue, hindfootLengthMUColumn,
                collCodeColumn, order, family, genus, '', state_province, county
              ]);
              break;
            case 37:
              sheets_2.appendRow(['', rowRange[catalogNumberColumn], scientificName, '', instituteCode,
                earLengthColumn, earLengthValue, earLengthMUColumn,
                collCodeColumn, order, family, genus, '', state_province, county
              ]);
              break;
          }
        }
        */
      }
    }
  }
}

/*
function updateRow(var_1, var_2, var_3) {
  return ['', rowRange[catalogNumberColumn], scientificName, '', instituteCode,
    var_1, var_2, var_3,
    collCodeColumn, order, family, genus, '', state_province, county
  ];
}
*/

function createTempSheet(sheet, ss) {
  var tempSheetName = 'tempSheet';
  const range = sheet.getDataRange();
  var newSheet = ss.insertSheet();

  newSheet.setName(tempSheetName);

  range.copyTo(newSheet.getRange(1, 1));

  return newSheet;
}

function getNewName(sheetRange, columns) {
  var parentName = sheetRange[columns[0]];

  if (columns.length > 1) {
    for (var i = 1; i < columns.length; i++) {

      if (sheetRange[columns[i]] != '') {
        parentName += ' ' + sheetRange[columns[i]];
      }

      else {
        parentName += sheetRange[columns[i]];
      }
    }
  }
  return parentName;
}