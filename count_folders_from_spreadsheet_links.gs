/* 
The goal for this tool is to indentify all the subfolders with more than or equal to a specified number of files within them and add to the running total.
A master spreadsheet with multiple sheets, each with their own set of links, is iterated through.
The end result is a final count of all the subfolders that have met the criteria specified.

You can add your own criteria other than just the number of files. For my purposes, the number of files within each subfolder
is what I am focusing on.

Assumptions:
- Hyperlinks are located in column 'A' in each sheet of the spreadsheet
- Hyperlinks are to drive folders ending with folder IDs
- The first hyperlink will to be accessed is in the second row of each sheet
- There are no blank rows beyond those needed to be accessed
*/

/*
The main function here is only for demonstration to avoid Google App Scripts caching issue.
The functions 'useLinksFromSheets' and 'iterateThroughFolders' can be used seperately.
If you choose to run this script as is with your own variables, note that you might get an error
stating your url is invalid. Try refreshing the page, or coming back to this script at another
point. Adding Spreadsheets as a service does not always help. This is a known issue and a frustrating one at that.

parameter: none
return: void
*/

function main () 
{
  // Hyperlink to the master spreadsheet
  const spreadsheet = 'https://docs.google.com/spreadsheets/d/1sDKuBsoBlOc7djNwYt9FSGZ0q1EKPUC3D1DxsimGILY/';
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

function useLinksFromSheets(spreadsheet, numToCountFiles) 
{
  var sheets = SpreadsheetApp.openByUrl(spreadsheet).getSheets();

  // This will contain the final total of subfolders that have a minimum of two files
  var foldersWithImages = 0;
  // Optional: Count of the number of links the script used
  var count = 0;

  // Loop to iterate through each sheet in the masterspread sheet
  for (const sheet of sheets) 
  {
      // Retrieves the number of rows in the spreadsheet
      let numOfFolders = sheet.getLastRow();  
      for (var i = 2; i <= numOfFolders; i++)
      {
        var range = sheet.getRange(i, 1, numOfFolders, 1)
        
        var richTextValue = range.getRichTextValue();
        var url = richTextValue.getLinkUrl();

        if (url != null)
        {
          var tempFolder = iterateThroughFolders(range.getValue(), numToCountFiles);
          count++;
          foldersWithImages += tempFolder;
        }
          // Optional: Print the total number of subfolders within the parent folder that meet the minimum file requirement to the console
          Logger.log("Running total of folders with images:  " + foldersWithImages);
      }
  }
  // Optional: Print the total number of hyperlinks accessed and the final total of all subfolders in all parent folders that met the minimum file requirement to the console
  Logger.log("Count of url's checked: " + count + "\nTotal count of folders with images: " + foldersWithImages);

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

function iterateThroughFolders(folderName, numToCountFiles) 
{
  var folder_counter = 0;
  var total_file_counter = 0;
  // Optional: Count of subfolders that do not meet the file minimum requirement
  //var folders_to_review = 0;
  var folders_with_images = 0;

  // Access the parent folder by using the string value from the cell on the spreadsheet
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.next();
  // Optional: Print the name of parent folder to the console
  Logger.log(folder.getName());

  var subfolders = folder.getFolders();
  
  // Loop through all the subfolders in the parent folder
  while (subfolders.hasNext()) 
  {
    var folder = subfolders.next();
    var files = folder.getFiles();
    var num_of_files = 0;

    // Loop through and count the files within the subfolder
    while (files.hasNext()) 
    {  
      var file = files.next();
      // Optional: Print the name of each file in the subfolder to the console 
      //var file_name = file.getName();
      num_of_files++;
    }

    // Optional: If block to count the number of subfolders that do not meet the minimum file requirement
    /*
    if (num_of_files < numToCountFiles) 
    {
      // Optional: Print subfolder name to the console
      //Logger.log("Review folder named: " + folder.getName());
      folders_to_review++;
    }
    */

    // Count all subfolders that met the file minimum requirement
    if (num_of_files >= numToCountFiles) 
    {
      folders_with_images++;
    }

    // Count the total number of subfolders iterated through in the parent folder
    folder_counter++;
  }

  // Optional: Print the number of folders iterated through in the parent folder to the console
  Logger.log("Total number of subfolders in the parent folder:  " + folder_counter);
  // Optional: Print the total number of subfolders in the parent folder that do not meet the file minimum requirement to the console 
  //Logger.log(folders_to_review);
  // Optional: Print the number of subfolders that meet the file minimum requirement to the console
  Logger.log("Number of subfolders with more than or equal to " + numToCountFiles + " files: " + folders_with_images);
  // Optional: Print the total number of files that met or exceeded the required file minimum counted in all the subfolders in the parent folder to the console
  Logger.log("Total of number of files/images in subfolder:  " + total_file_counter);

  return folders_with_images;
}
