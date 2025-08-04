function run() {
  // This hyperlink to the top level spreadsheet that will be refered to when creating the folders
  const ssHyperlink = 'https://YOUR_GOOGLE_SPREADSHEET_URL';
  // Name of the sheet to be references
  const sheetName = 'YOUR_SHEET_NAME';
  // This is the Id for the folder where your newly created folders will be populated
  const folderLocationId = 'YOUR_GOOGLE_FOLDER_ID';

  // This calls the main function after providing it all the proper parameters
  createParentFolderCopySectionSpreadsheet(ssHyperlink, sheetName, folderLocationId);
}

// Consider this the main function that calls all subsequent functions.
function createParentFolderCopySectionSpreadsheet(ssHyperlink, nameOfSheet, folderLocationId) {
  // Template IDs, types, and names
  const templateOrder_FamilySS = 'YOUR_GOOGLE_FILE_ID';
  const templateO_F_s_subSS = 'YOUR_GOOGLE_FILE_ID';
  const googleSSFileType = MimeType.GOOGLE_SHEETS;
  const templateSheetName = 'YOUR_SHEET_NAME';
  const sheetName_1 = 'YOUR_SHEET_NAME';
  var templateImageID_1 = 'YOUR_TEMPLATE_IMAGE_ID';
  var imageName_1 = 'YOUR_TEMPLATE_NAME.jpg';
  var templateImageID_2 = 'YOUR_TEMPLATE_IMAGE_ID';
  var imageName_2 = 'YOUR_TEMPLATE_NAME.jpg';

  // Top level spreadsheet that the script will refer to when creating the folders
  const ss = SpreadsheetApp.openByUrl(ssHyperlink);
  const sheets = ss.getSheets();

  for (const sheet of sheets) {
    var sheetName = sheet.getName();
    if (sheetName == nameOfSheet && !sheet.isSheetHidden()) {
      const startingRow = 1;
      const startingColumn = 4;
      const endingRow = sheet.getLastRow();
      const endingColumn = 6;

      const nameColumns_1 = [4];
      const nameColumns_2 = [4, 5];
      const nameColumns_3 = [5, 6];
      const nameColumns_4 = [5, 6, 7, 8];
      const valueColumn_1 = [1];

      var folderId = '';
      let folder_2;
      var folderId_2 = '';
      let folder_3;
      var folderId_3 = '';
      var ssId_1 = '';
      var ssId_2 = '';
      var sheetId_1 = '';
      var sheetId_2 = '';
      var tempName_4 = '';
      var tempName_3 = '';
      var tempValue_1 = '';

      var tempSheet_1 = createTempSpreadsheet(sheet, ss, startingRow, startingColumn, endingRow, endingColumn);
      var lastRow = tempSheet_1.getLastRow();
      var row = tempSheet_1.getDataRange().getValues();

      ss.deleteSheet(tempSheet_1);

      for (var i = 1; i < lastRow; ++i) {
        // Row from spreadsheet
        var rowRange = row[i];

        const name_1 = getNewName(rowRange, nameColumns_1);
        const name_2 = getNewName(rowRange, nameColumns_2);
        const name_3 = getNewName(rowRange, nameColumns_3);
        const name_4 = getNewName(rowRange, nameColumns_4);
        const value_1 = getNewName(rowRange, valueColumn_1);

        //Logger.log(name_1 + ' ' + name_2 + ' ' + name_3);

        var folder_1 = DriveApp.getFoldersByName(name_1).next();

        // If text string is not null, else print to screen
        if (name_2) {
          // Find folder, else create it
          folderId = findNestedFolderOrCreateFolder(folder_1, name_2);
          // Find spreadsheet ID, else copy template and rename it
          ssId_1 = findOrCreateFile(folderId, name_2, googleSSFileType, templateOrder_FamilySS);

          if (tempName_4 != name_4) {
            // Open folder
            folder_2 = DriveApp.getFolderById(folderId);
            // Find  folder, or create it
            folderId_2 = findNestedFolderOrCreateFolder(folder_2, name_4);
            // Find spreadsheet, or create it
            ssId_2 = findOrCreateFile(folderId_2, name_4, googleSSFileType, templateO_F_s_subSS);
            // Rename the sheet
            sheetId_1 = SpreadsheetApp.openById(ssId_2).getSheets()[0].setName(name_3).getSheetId();
            let returnedSheet = copyRowtoSheet(row[i], ssId_2, sheetId_1);
            returnedSheet.deleteRow(3);
            //
            folder_3 = DriveApp.getFolderById(folderId_2);
            //folderId_3 = findNestedFolderOrCreateFolder(folder_3, value_1);

            let tempFolderUrl = DriveApp.getFolderById(folderId_2).getUrl();
            let newRichTextValue = SpreadsheetApp.newRichTextValue().setText(name_4).setLinkUrl(tempFolderUrl).build();

            // Update & manipulate spreadsheet
            let activeSS = SpreadsheetApp.openById(ssId_1);
            sheetId_2 = findOrCreateSheetFromTemplate(ssId_1, name_3, templateSheetName);

            var namedSheet = activeSS.getSheetByName(name_3).activate();
            namedSheet.appendRow([name_4]);

            var lastRowRange = namedSheet.getRange(namedSheet.getLastRow(), 1);
            lastRowRange.getCell(1, 1).setRichTextValue(newRichTextValue);

            var numOfSheets = activeSS.getNumSheets();
            if (numOfSheets > 2) {
              activeSS.moveActiveSheet(numOfSheets - 1);
            }

            if (tempName_3 != name_3) {
              let modSheet = activeSS.getSheetByName(sheetName_1);

              modSheet.appendRow([name_3]);
              let tempRow = modSheet.getLastRow();
              modSheet.getRange(tempRow, 2, 1, 1).setFormula('=sum(' + name_3 + '!E2:E)');
              modSheet.getRange(tempRow, 3, 1, 1).setFormula('=sum(' + name_3 + '!G2:G)');
              modSheet.getRange(tempRow, 4, 1, 1).setFormula('=sum(' + name_3 + '!J2:J)');
              Logger.log(tempName_3);
            }
          }
          else {
            copyRowtoSheet(row[i], ssId_2, sheetId_1);
            Logger.log(tempName_4);
          }

          const folderIterator = folder_3.getFoldersByName(value_1);
          if (!folderIterator.hasNext()) {
            folderId_3 = folder_3.createFolder(value_1).getId();
            var templateImageID = '';
            var imageName = '';
            if (row[i][12] == 'YOUR_VARIABLE' || row[i][11] == 'YOUR_VARIABLE') {
              templateImageID = templateImageID_1;
              var imageName = imageName_1;
            }
            else {
              var templateImageID = templateImageID_2;
              var imageName = imageName_2;
            }
            var copiedImageID = copyTemplate(imageName, folderId_3, templateImageID);
            addCommentToImage(copiedImageID);
            //Logger.log(subfolderName);
          }

          tempName_3 = name_3;
          tempName_4 = name_4;
          tempValue_1 = value_1;
        }

        else {
          //Logger.log('New Name is false');
        }
      }
    }
  }
}

function createTempSpreadsheet(sheet, ss, startRow, startColumn, endRow, endColumn) {
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

function copySpreadsheet(range, lastRow, folderName, ssID, sheetId) {
  var activeSheet = SpreadsheetApp.openById(ssID).getSheetById(sheetId).activate();
  activeSheet.renameActiveSheet(folderName);
  var tempName = '';
  for (var i = 0; i < lastRow; i++) {
    tempName = getParentName(range[i]);
    if (tempName == folderName) {
      sheet.appendRow(range[i]);
    }
  }
  sheet.deleteRow(3);
}

function addRow(spreadSheetID, range_2) {
  var ss = SpreadsheetApp.openById(spreadSheetID);
  ss.appendRow([range_2]);
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

  // If folder was not found, else create it
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

function findOrCreateFile(folderId, fileName, fileType, templateId) {
  var folder = DriveApp.getFolderById(folderId);
  let files = folder.getFilesByType(fileType);
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

function findOrCreateSheetFromTemplate(spreadSheetID, sheetName, templateSheetName) {
  let tempSS = SpreadsheetApp.openById(spreadSheetID);
  var tempSheet = tempSS.getSheetByName(sheetName);
  var tempSheetId = '';
  if (tempSheet) {
    tempSheetId = tempSheet.getSheetId();
  }
  else {
    // Duplicate a template sheet in existing spreadsheet
    tempSS.getSheetByName(templateSheetName).activate();
    tempSheetId = tempSS.duplicateActiveSheet().getSheetId();
    tempSS.getSheetById(tempSheetId).setName(sheetName).showSheet();
  }
  return tempSheetId;
}
function addCommentToImage(fileId) {

  var anchorString = 
  {
    'r': 'head',
    'a': [ 
    { 
      'rect' : 
        {
          'x': 0.062145189162929215, 
          'y': 0.1765799256505576, 
          'w': 0.3208021534910159, 
          'h': 0.4405204460966542
        }
    }
    ]
  }

  // Define the comment content
  var commentContent = "YOUR_COMMENT";

  var newComment = Drive.newComment();
  newComment.content = commentContent;
  newComment.anchor = anchorString;

  //Logger.log(newComment);
  Drive.Comments.create(newComment, fileId, { fields: '*' });
}