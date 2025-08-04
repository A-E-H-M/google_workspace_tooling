function addCommentToImage() {

  var fileId = "ADD FILE ID HERE";
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
Logger.log(commentContent);
Logger.log(newComment);

}
