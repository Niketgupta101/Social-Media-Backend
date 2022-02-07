const Post = require("../models/post");
const Comment = require("../models/comment");
const LikeComment = require("../models/likeComment");
const Reply = require("../models/reply");
const Notification = require("../models/notification");
const ErrorResponse = require("../utils/errorResponse");
const { sendPostCommentMail, sendCommentReplyMail } = require("./emailProvider");

exports.getCommentById = async (commentId, next) => {
  try {
    let comment = await Comment.findOne({ _id: commentId });

    if (!comment)
      return next(new ErrorResponse("No comment found with given id", 404));

    return { success: true, comment };
  } catch (error) {
    return next(error);
  }
};

exports.getAllComments = async (postId, pageNo, pageLimit, next) => {
  try {
    let post = await Post.findOne({ _id: postId }, { _id: 1 });

    if (!post)
      return next(new ErrorResponse("No Post found with given id", 404));

    let comments = await Comment.find({ postId })
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit);

    return { success: true, comments };
  } catch (error) {
    return next(error);
  }
};

exports.createNewComment = async (loggedUserId, loggedUserName, isNotification, postId, commentDetails, next) => {
    try {
        let post = await Post.findOne(
          { _id: postId }, 
          { isCommentBlocked: 1, commentCount: 1, postedBy: 1 })
          .populate('postedBy', { emailId: 1 });
        
        if(!post) return next(new ErrorResponse("No post found with fiven id", 404));

        if(post.isCommentBlocked)
        return next(new ErrorResponse("Comment section for this post has been blocked.", 400));

        let commentData = {
            ...commentDetails,
            commentedBy: loggedUserId,
            postId,
        }
        post.commentCount = post.commentCount + 1;
        await post.save();
        const newComment = await Comment.create(commentData);

        // send email notification to the user.
        if(isNotification)
        await sendPostCommentMail(post.postedBy.emailId, loggedUserName, newComment._id, post._id);

        // send in app notification to the user.
        let notification = {
          content: `${loggedUserName} has commented to your post."`,
          user: post.postedBy,
          typeOfNoti: 'Comment',
          idOfType: newComment._id
        }
        await Notification.create(notification);

        return { success: true, comment: newComment };
    } catch (error) {
        return next(error);
    }
}

exports.editCommentById = async (loggedUserId, commentId, commentDetails, next) => {
    try {
        let comment = await Comment.findOne({ _id: commentId });

        if(!comment) return next(new ErrorResponse("No comment found with given id", 404));

        if(loggedUserId !== comment.commentedBy.valueOf())
        return next(new ErrorResponse("You are not authorised to edit this comment", 400));

        comment = { ...comment ,...commentDetails, updatedAt: Date.now() };

        await comment.save();

        return { success: true, comment };
    } catch (error) {
        return next(error);
    }
}

exports.deleteCommentById = async (loggedUserId, commentId, next) => {
  try {
    let comment = await Comment.findOne({ _id: commentId });

    if(!comment) return next(new ErrorResponse("Comment not found", 404));

    if(comment.commentedBy.valueOf() !== loggedUserId)
    return next(new ErrorResponse("You are not authorised to delete this comment", 400));

    let post = await Post.findOne({ _id: comment.postId }, { commentCount: 1 });
    post.commentCount = post.commentCount - 1;
    await post.save();
    await comment.remove();

    return {success: true, message: "Comment deleted successfully" };
  } catch (error) {
    return next(error);
  }
}

exports.likeCommentById = async (loggedUserId, commentId, next) => {
  try {
    let likeComment = await LikeComment.findOne({ commentId, commentedBy: loggedUserId});

    let comment = await Comment.findOne({ _id: commentId }, { likeCount: 1 });
    if(!comment) return next(new ErrorResponse(`No such comment found`, 404));
        
    if(!likeComment)
    {
        comment.likeCount = comment.likeCount + 1;
        await comment.save();
        await LikeComment.create(likeComment);
        return { success: true, message: `Comment liked successfully`};
    }

    comment.likeCount = comment.likeCount - 1;
    await comment.save();
    await likeComment.remove();
    return { success: true, message: `Comment unliked successfully`};
  } catch (error) {
    return next(error);
  }
}

exports.createNewReply = async (loggedUserId, loggedUserName, commentId, replyDetails, next) => {
  try {
      let comment = await Comment.findOne({ _id: commentId }, { replyCount: 1 })
        .populate('commentedBy', { emailId: 1 });
      
      if(!comment) return next(new ErrorResponse("No comment found with fiven id", 404));

      let replyData = {
          ...replyDetails,
          repliedBy: loggedUserId,
          commentId,
      }
      comment.replyCount = comment.replyCount + 1;
      await comment.save();
      const newReply = await Reply.create(replyData);

      // send email notification to the user on whose comment loggedUser has replied.
      if(isNotification)
      await sendCommentReplyMail(comment.commentedBy.emailId, loggedUserName, newReply._id, comment._id);

      // send in app notification to the user on whose comment loggedUser has replied.
      let notification = {
        content: `${loggedUserName} has replied to your comment."`,
        user: comment.commentedBy,
        typeOfNoti: 'Reply',
        idOfType: newReply._id
      }
      await Notification.create(notification);

      return { success: true, reply: newReply };
  } catch (error) {
      return next(error);
  }
}

exports.getAllReplies = async (commentId, pageNo, pageLimit, next) => {
  try {
    let comment = await Comment.findOne({ _id: commentId }, { _id: 1 });

    if (!comment)
      return next(new ErrorResponse("No comment found with given id", 404));

    let replies = await Reply.find({ commentId })
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit);

    return { success: true, replies };
  } catch (error) {
    return next(error);
  }
};

exports.editReplyById = async (loggedUserId, replyId, replyDetails, next) => {
  try {
      let reply = await Reply.findOne({ _id: replyId });

      if(!reply) return next(new ErrorResponse("No reply found with given id", 404));

      if(loggedUserId !== reply.repliedBy.valueOf())
      return next(new ErrorResponse("You are not authorised to edit this reply", 400));

      reply = { ...reply, ...replyDetails, updatedAt: Date.now() };

      await reply.save();

      return { success: true, reply };
  } catch (error) {
      return next(error);
  }
}

exports.deleteReplyById = async (loggedUserId, replyId, next) => {
try {
  let reply = await Reply.findOne({ _id: replyId });

  if(!reply) return next(new ErrorResponse("Reply not found", 404));

  if(reply.repliedBy.valueOf() !== loggedUserId)
  return next(new ErrorResponse("You are not authorised to delete this reply", 400));

  let comment = await Comment.findOne({ _id: reply.commentId }, { replyCount: 1 });
  comment.replyCount = comment.replyCount - 1;
  await comment.save();
  await reply.remove();

  return {success: true, message: "Reply deleted successfully" };
} catch (error) {
  return next(error);
}
}