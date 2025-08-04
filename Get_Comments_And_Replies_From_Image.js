function main () {
  const folderName = 'YOUR_FOLDER_NAME';
  iterateThroughFolders(folderName);
}

function iterateThroughFolders(folderName) {
  var topLevelFolders = DriveApp.getFoldersByName(folderName);
  var topLevelFolder = topLevelFolders.next();
  Logger.log(topLevelFolder.getName());
  var parentFolders = topLevelFolder.getFolders();

  while (parentFolders.hasNext()) {
    var parentFolder = parentFolders.next();
    var subfolders = parentFolder.getFolders();

    while (subfolders.hasNext()) {
      var folder = subfolders.next();
      var files = folder.getFiles();

      while (files.hasNext()) {  
        var file = files.next();
        var fileName = file.getName();
        if (fileName == 'YOUR_IMAGE_NAME.jpg' || fileName == 'YOUR_IMAGE_NAME.jpg') {
          Logger.log(fileName);
          getCommentsFromImage(file.getId());
        }
      }
    }
  }
}

function getCommentsFromImage(fileId) {

  // Access the owners comments via Drive API
  var commentsList = Drive.Comments.list(fileId, { fields: '*' });
  var jobject = JSON.parse(commentsList);
  const repliesIdsList = [];

  // Loop through comments and access details
  for (var i = 0; i < jobject.comments.length; i++) {
    // Getting the text of the comment
    var comment = jobject.comments[i].content;
    var commentAuthor = jobject.comments[i].author.displayName;
    // The commentId is needed as parameter for the Drive.Replies below
    var commentId = jobject.comments[i].id;
    repliesIdsList.push(commentId);
    if (commentAuthor != 'NAME_OF_THE_AUTHOR'){
    Logger.log(commentAuthor + ' ' + comment);
    }
  }

  // Loop through the replies
  for (var i = 0; i < repliesIdsList.length; i++){
    var repliesList = Drive.Replies.list(fileId, repliesIdsList[i], { fields: '*' });
    var replyContentById = JSON.parse(repliesList);

    for (var i = 0; i < replyContentById.replies.length; i++) {
      var replyContents = replyContentById.replies[i].content;
      var whoReplied = replyContentById.replies[i].author.displayName;
      Logger.log(whoReplied + "    " + replyContents);
    }
  }
}