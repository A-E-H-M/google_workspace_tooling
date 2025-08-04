function create_SubandParent_Folders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Gets the sheet by index/position within the whole spreadsheet
  const sheet = ss.getSheets()[0];

  const lastRow = sheet.getLastRow();
  Logger.log("The last row is " + lastRow);

  // Change the Folder ID to the parent folder you want your subfolders to live in
  const rootFolder = DriveApp.getFolderById('ADD FILE ID HERE');
  Logger.log(ss.getName());

  // For loop to create parent and subfolders
  // Change to lastRow when ready
  for (var i = 7870; i < 8618; i++) {
    if (!sheet.isRowHiddenByFilter(i)) {
      const catalogId = sheet.getRange(i, 2).getValue();
      const family = sheet.getRange(i, 6).getValue();
      const genus = sheet.getRange(i, 7).getValue();
      const species = sheet.getRange(i, 8).getValue();
      const subspecies = sheet.getRange(i, 9).getValue();
      
      var rowArray = [catalogId, family, genus, species, subspecies];

      let subfolderName = catalogId;
      if (species == "") {
        var parentFolderName = (family + "_" + genus);
      }
      if (subspecies == "") {
        var parentFolderName = (family + "_" + genus + "_" + species);
      }
      else {
        var parentFolderName = (family + "_" + genus + "_" + species + "_" + subspecies);
      }

      if (subfolderName && parentFolderName) {
        // Check if parent folder exists, if not create it
        let parentFolder;
        const parentFolderIterator = rootFolder.getFoldersByName(parentFolderName);
      
        if (parentFolderIterator.hasNext()) {
          parentFolder = parentFolderIterator.next();
        } 
        else {
          parentFolder = rootFolder.createFolder(parentFolderName);
          const newParentFolderId = parentFolder.getId();
          const newParentName = parentFolder.getName();
          Logger.log(parentFolderName);
          
          //////
          // This is where the template is copied, moved, renamed, and its sheet is also renamed
          const spreadsheetTemplate = DriveApp.getFileById('ADD_YOUR_FILE_ID_HERE'); // Spreadsheet template

          // The second parameter of this .makeCopy has to be a folder
          const copiedFile = spreadsheetTemplate.makeCopy(newParentName, DriveApp.getFolderById(newParentFolderId));
          Logger.log(copiedFile.getName());

          // Gets new template spreadsheet by ID
          const newSpreadsheet = copiedFile.getId();

          // Renames the sheet name -- should be named by the parent folder
          const openNewSpreadsheet = SpreadsheetApp.openById(newSpreadsheet).renameActiveSheet(newParentName);
          //////
        }

        // Create subfolder inside parent folder if it doesn't exist
        const subFolderIterator = parentFolder.getFoldersByName(subfolderName);
        if (!subFolderIterator.hasNext()) {
          var subFolderId = parentFolder.createFolder(subfolderName).getId();

          const identPrepTemplate = DriveApp.getFileById('ADD_YOUR_FILE_ID_HERE');
          const copiedTemplate = identPrepTemplate.makeCopy(DriveApp.getFolderById(subFolderId)).getId();
          addCommentToImage(copiedTemplate);
          Logger.log(subfolderName);
        }
      }
    }
  }
}

// Adding comment to an image defined by a region on image
function addCommentToImage(fileId) {
  var anchorString = 
  {
    'r': 'head',
    'a': [ 
    { 
      'rect' : 
        {
          'x': .062145189162929215, 
          'y': .1765799256505576, 
          'w': .3208021534910159, 
          'h': .4405204460966542
        }
    }
    ]
  }

  // Define the comment content
  var commentContent = "YOUR_COMMENT";

  var newComment = Drive.newComment();
  newComment.content = commentContent;
  newComment.anchor = anchorString;

  Logger.log(newComment);
  Drive.Comments.create(newComment, fileId, { fields: '*' });
}
