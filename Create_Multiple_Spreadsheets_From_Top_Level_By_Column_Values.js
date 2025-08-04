function run() {
  // This hyperlink to the top-level spreadsheet that will be refered to when creating the folders
  const ssHyperlink = 'YOUR_GOOGLE_SPREADSHEET_URL';
  // Name of the sheet to be references
  const sheetName = 'YOUR_SHEET_NAME';
  // This is the Id for the folder where your newly created folders will be populated
  const folderLocationId = 'YOUR_FOLDER_ID';

  // This calls the main function after providing it all the proper parameters
  createParentFolderCopySectionSpreadsheet(ssHyperlink, sheetName, folderLocationId);
}

// Consider this the main function that calls all subsequent functions.
function createParentFolderCopySectionSpreadsheet(ssHyperlink, nameOfSheet, folderId) {
  // Template IDs, types, and names
  const templateO_F_s_subSS = 'YOUR_TEMPLATE_FILE_ID';
  const googleSSFileType = MimeType.GOOGLE_SHEETS;


  // Top level spreadsheet that the script will refer to when creating the folders
  const ss = SpreadsheetApp.openByUrl(ssHyperlink);
  const sheets = ss.getSheets();

  for (const sheet of sheets) {
    var sheetName = sheet.getName();
    if (sheetName == nameOfSheet && !sheet.isSheetHidden()) {

      const nameColumns_4 = [5, 6, 7, 8];

      var ssId_2 = '';
      var sheetId_1 = '';
      var tempName_4 = '';

      var tempSheet_1 = createTempSpreadsheet(sheet, ss);
      var lastRow = tempSheet_1.getLastRow();
      var row = tempSheet_1.getDataRange().getValues();

      ss.deleteSheet(tempSheet_1);

      for (var i = 1; i < lastRow; ++i) {
        // Row from spreadsheet
        var rowRange = row[i];

        // Column5_Column6_Column7_Column8
        const name_4 = getNewName(rowRange, nameColumns_4);

        if (tempName_4 != name_4) {
          // Find Column5_Column6_Column7_Column8 spreadsheet, or create it
          ssId_2 = findOrCreateFile(folderId, name_4, googleSSFileType, templateO_F_s_subSS);
          // Rename the sheet to Column5_Column6
          sheetId_1 = SpreadsheetApp.openById(ssId_2).getSheets()[0].setName(name_4).getSheetId();
          let returnedSheet = copyRowtoSheet(row[i], ssId_2, sheetId_1);
          returnedSheet.deleteRow(3);
        }
        else {
          copyRowtoSheet(row[i], ssId_2, sheetId_1);
          Logger.log(tempName_4);
        }
        tempName_4 = name_4;

      }
    }
  }
}
/*
function createTempSpreadsheet(sheet, ss, startRow, startColumn, endRow, endColumn) {
  var tempSheetName = 'tempSheet';
  const range = sheet.getDataRange();
  var newSheet = ss.insertSheet();

  newSheet.setName(tempSheetName);

  range.copyTo(newSheet.getRange(1, 1));

  return newSheet;
}
*/

function createTempSpreadsheet(sheet, ss) {
  var tempSheetName = 'tempSheet';
  const range = sheet.getDataRange();
  var newSheet = ss.insertSheet();

  newSheet.setName(tempSheetName);

  range.copyTo(newSheet.getRange(1, 1));

  return newSheet;
}

function copyTemplate(copiedFileName, parentFolderId, templateID) {
  // This is where the template is copied, moved, renamed, and its sheet is also renamed
  const spreadsheetTemplate = DriveApp.getFileById(templateID);

  // The second parameter of this .makeCopy has to be a folder
  const copiedFileID = spreadsheetTemplate.makeCopy(copiedFileName, DriveApp.getFolderById(parentFolderId)).getId();

  return copiedFileID;
}


function copyRowtoSheet(range, ssID, sheetId) {
  var activeSheet = SpreadsheetApp.openById(ssID).getSheetById(sheetId);
  activeSheet.appendRow(range);
  return activeSheet;
}

function getNewName(sheetRange, columns) {
  var parentName = sheetRange[columns[0]];

  if (columns.length > 1) {
    for (var i = 1; i < columns.length; i++) {

      if (sheetRange[columns[i]] != '') {
        parentName += '_' + sheetRange[columns[i]];
      }

      else {
        parentName += sheetRange[columns[i]];
      }
    }
  }
  return parentName;
}

function findNestedFolderOrCreateFolder(topFolder, nextFolderName) {
  const foldersFound = topFolder.getFoldersByName(nextFolderName);
  let tempFolderId;

  // If Order_Family folder was found, else create it
  if (foldersFound.hasNext()) {
    tempFolderId = foldersFound.next().getId();
    //Logger.log('existing order_family folder: ' + tempFolderId);
  }

  else {
    tempFolderId = createNewFolder(topFolder, nextFolderName);
  }

  return tempFolderId;
}

function createNewFolder(parentFolder, newFolderName) {
  newFolderId = parentFolder.createFolder(newFolderName).getId();
  //Logger.log('new order_family folder: ' + newFolderId);

  return newFolderId;
}

// This assumes there is only one spreadsheet in the folder
function findOrCreateFile(folderId, fileName, fileType, templateId) {
  var files = DriveApp.getFolderById(folderId).getFilesByName(fileName);
  //var files = DriveApp.getFilesByName(fileName);
  //let files = folder.getFilesByType(fileType);
  let fileId = '';

  if (files.hasNext()) {
    file = files.next();
    fileNamed = file.getName();
    fileId = file.getId();
    if (fileNamed != fileName) {
      file.setName(fileName);
    }
  }
  else {
    fileId = copyTemplate(fileName, folderId, templateId);
  }

  return fileId;
}