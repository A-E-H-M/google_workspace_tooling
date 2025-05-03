function getRepliesFromImage() {

  var fileId = 'ADD FILE ID HERE';

  // Access the owners comments via Drive API
  var commentsList = Drive.Comments.list(fileId, { fields: '*' });
  var jobject = JSON.parse(commentsList);
  const repliesIdsList = [];

  // Loop through comments and access details
  for (var i = 0; i < jobject.comments.length; i++) {
    // Getting the text of the comment
    var comment = jobject.comments[i].content;
    // The commentId is needed as parameter for the Drive.Replies below
    var commentId = jobject.comments[i].id;
    var commentAnchor = jobject.comments[i].anchor;
    repliesIdsList.push(commentId);
    Logger.log(comment);
    Logger.log(commentAnchor);
    Logger.log(jobject.comments[i])
  }

  // Loop through the replies
  for (var i = 0; i < repliesIdsList.length; i++){
    var repliesList = Drive.Replies.list(fileId, repliesIdsList[i], { fields: '*' });
    var replyContentById = JSON.parse(repliesList);

    for (var i = 0; i < replyContentById.replies.length; i++) {
      // Gets the text from the comment
      var replyContents = replyContentById.replies[i].content;
      // Gets the author or the comment
      var whoReplied = replyContentById.replies[i].author.displayName;
      Logger.log(replyContents);
      Logger.log(whoReplied);
    }
  }

}
