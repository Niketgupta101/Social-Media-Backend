const {
  getCommentById,
  getAllComments,
  createNewComment,
  editCommentById,
  deleteCommentById,
  likeCommentById,
  createNewReply,
  getAllReplies,
  editReplyById,
  deleteReplyById
} = require("../services/commentProvider");

exports.fetchComment = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const response = await getCommentById(commentId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchAllComments = async (req, res, next) => {
  const { postId, pageNo, pageLimit } = req.params;

  try {
    const response = await getAllComments(postId, pageNo, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const loggedUserName = req.user.username;
  const isNotification = req.user.Settings.Notifications;
  const { postId } = req.params;
  const commentDetails = req.body;

  try {
    const response = await createNewComment(loggedUserId, loggedUserName, isNotification, postId, commentDetails, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.editComment = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { commentId } = req.params;
  const commentDetails = req.body;

  try {
    const response = await editCommentById(loggedUserId, commentId, commentDetails, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { commentId } = req.params;

  try {
    const response = await deleteCommentById(loggedUserId, commentId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.likeComment = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { commentId } = req.params;

  try {
    const response = await likeCommentById(loggedUserId, commentId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.createReply = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { commentId } = req.params;

  try {
    const response = await createNewReply(loggedUserId, commentId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchAllReply = async (req, res, next) => {
  const { commentId, pageNo, pageLimit } = req.params;

  try {
    const response = await getAllReplies(commentId, pageNo, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.editReply = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { replyId } = req.params;

  try {
    const response = await editReplyById(loggedUserId, replyId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.deleteReply = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { replyId } = req.params;

  try {
    const response = await deleteReplyById(loggedUserId, replyId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
