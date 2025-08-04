// This script is a combination of two other scripts provided by those listed links below
// https://stackoverflow.com/questions/75315605/cloudconvert-conversion-api-pdf-to-png-using-google-apps-script
// https://gist.github.com/tanaikech/94ff0713a7bfe2d3e43afbfe54611190

async function main() {
const pdfFileId = '1Ozl917k9KxB9I6H68YUMhuhzS-8XW3a8';
const folderId = '1p1jDKc1u4HwtJAZzJB7jM4SFPrMJKu5b';
await convertPDFToPNG_(pdfFileId, folderId);
}

async function convertPDFToPNG_(pdfFileId, folderId) {

  var pdf = DriveApp.getFileById(pdfFileId);
  const blob = pdf.getAs('application/pdf');

  // Getting PDF library
  const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
  eval(UrlFetchApp.fetch(cdnjs).getContentText()); // Load pdf-lib
  const setTimeout = function (f, t) {
    // Overwrite setTimeout with Google Apps Script.
    Utilities.sleep(t);
    return f();
  };

  const data = new Uint8Array(blob.getBytes());

  const pdfData = await PDFLib.PDFDocument.load(data);

  const pageLength = pdfData.getPageCount();

  Logger.log(pageLength);

  for (let i = 0; i < pageLength; i++) {

    // Print the page number that is being processed
    console.log(`Processing page: ${i + 1}`);

    // Create a new PDF
    const pdfDoc = await PDFLib.PDFDocument.create();

    // Copy the page [i] from the loaded PDF into a new array called page
    const [page] = await pdfDoc.copyPages(pdfData, [i]);
    
    // Add new array to newly created PDF
    pdfDoc.addPage(page);

    // Serialize the newly created PDF to bytes (an Uint8Array)
    const bytes = await pdfDoc.save();

    //
    const blob = Utilities.newBlob(bytes, MimeType.PDF, 'delete_me.pdf');
    
    // Create the file with new blob and get the id
    var id = DriveApp.getFolderById(folderId).createFile(blob).getId();

    Logger.log(id);

    Utilities.sleep(4000);

    var link = Drive.Files.get(id, { fields: 'thumbnailLink' });

    var url = JSON.parse(link);

    // Change the thumbnailUrl to get a larger file
    const thumbnailURL = link.thumbnailLink.replace(/=s.+/, "=s2500");

    // Get folder name
    var folderName = DriveApp.getFolderById(folderId).getName();
    
    // Take the filename and remove the extension part
    var char = String.fromCharCode(97 + i);
    const newFileName = 'FMNH_' + folderName + '_' + char + '.png';

    Logger.log(newFileName);

    // Fetch the "thumbnail-Image"
    const pngBlob = UrlFetchApp.fetch(thumbnailURL).getBlob();

    // Save the file in the destination folder
    const destinationFolder = DriveApp.getFolderById(folderId);
    var pngFile = destinationFolder.createFile(pngBlob).setName(newFileName).getId();

    var file = DriveApp.getFileById(pngFile);
    var blob2 = file.getBlob();

    var blobCopy = blob2.copyBlob();
    var jpgBlob = blobCopy.getAs(MimeType.JPEG);

    //destinationFolder.createFile(jpgBlob).setName('FMNH_' + folderName + '_' + (i+1) + '.jpg');
    //var char = 65 + i;
    destinationFolder.createFile(jpgBlob).setName('FMNH_' + folderName + '_' + char + '.jpg');



    DriveApp.getFileById(id).setTrashed(true);
    DriveApp.getFileById(pngFile).setTrashed(true);
  }
  pdf.setName(folderName + '.pdf');
  pdf.moveTo(DriveApp.getFolderById('1XmHcgaHOG486ToNKN0MVxcYmGxh3C1gd'));
}
