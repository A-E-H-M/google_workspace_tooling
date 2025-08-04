function main () 
{
  // Hyperlink to the spreadsheet to be referenced
  const spreadsheet = 'https://YOUR_GOOGLE_SPREADSHEET_URL';
  // The number of files required for a subfolder to be included in the running total
  const numToCountFiles = 2;

  useLinksFromSheets(spreadsheet, numToCountFiles);
}

/*
This function iterates through the contents of each parent folder and subfolders to count the relevant number of folders.
The folder depth is two.

parameter: string, int
return: int
*/

async function useLinksFromSheets(spreadsheet, numToCountFiles) 
{

  // Getting PDF library
  const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
  eval(UrlFetchApp.fetch(cdnjs).getContentText()); // Load pdf-lib
  const setTimeout = function (f, t) {
    // Overwrite setTimeout with Google Apps Script.
    Utilities.sleep(t);
    return f();
  };

  var sheets = SpreadsheetApp.openByUrl(spreadsheet).getSheets();

  // This will contain the final total of subfolders that have a minimum of two files
  var foldersWithImages = 0;

  // Loop to iterate through each sheet in the top level spreadsheet
  for (const sheet of sheets) 
  {
    if(!sheet.isSheetHidden())
    {
      let numOfFolders = sheet.getLastRow();  
      for (var i = 2; i <= numOfFolders; i++)
      {
        
        if (!sheet.isRowHiddenByUser(i)) {
          var range = sheet.getRange(i, 1, numOfFolders, 1);
          var richTextValue = range.getRichTextValue();
          var url = richTextValue.getLinkUrl();

          if (url != null) {
            var tempFolderName = range.getValue();

            // Access the parent folder by using the string value from the cell on the spreadsheet
            var folders = DriveApp.getFoldersByName(tempFolderName);
            var folder = folders.next();
            // Optional: Print the name of parent folder to the console
            Logger.log(folder.getName());

            var subfolders = folder.getFolders();
            
            var countFolders = 0;
            var countImages = 0;
            var foldersWithImages = 0;

            // Loop through all the subfolders in the parent folder
            while (subfolders.hasNext()) 
            {
              var folder = subfolders.next();
              var files = folder.getFiles();
              var fileCounter = 0;

              while (files.hasNext()) {  
                var file = files.next();
                var tempFolder = await countImagesInFile(file);
                if (tempFolder >= 1) {
                  countImages+=tempFolder;
                  fileCounter++;
                }
              }
              if (fileCounter >=1 )
              {
                foldersWithImages++;
              }
              countFolders++;
            }
            
            Logger.log('Count of images per species: ' + countImages + ' Count of folders with images: ' + foldersWithImages + ' Folders Checked: ' + countFolders);

            var totalCell = sheet.getRange(i, 5);
            totalCell.setValue(foldersWithImages);

            var imageCell = sheet.getRange(i, 7);
            imageCell.setValue(countImages);

            var date = Utilities.formatDate(new Date(), "GMT-5", "MMM d, yyyy 'at' h:mm a");

            var tempDate = sheet.getRange(i, 8);
            tempDate.setValue(date);
          }
        }
      }
    }
  }
  return foldersWithImages;
}

/*
This function iterates through the contents of each parent folder and subfolders to count the relevant number of folders. 
In this example, the criteria to count as a relevant folder is if there are two or more files within it.
This total count of relevant files is returned.
*/

/*
parameter: string, int
return: int
*/

async function countImagesInFile(file) 
{
  var totalPDFPageCount = 0;
      if (file.getMimeType() == 'application/pdf')
      {
        //Logger.log('true');
        const blob = file.getAs('application/pdf');
        const data = new Uint8Array(blob.getBytes());
        const pdfData = await PDFLib.PDFDocument.load(data);
        const pdfPageCount = pdfData.getPageCount();
        totalPDFPageCount += pdfPageCount;
      }

      if (file.getMimeType() == 'image/jpeg')
      {
        var imageName = file.getName();
        if (imageName != 'YOUR_IMAGE_NAME.jpg' & imageName != 'YOUR_IMAGE_NAME.jpg')
        {
          totalPDFPageCount++;
        }
      }

  return totalPDFPageCount;
}
