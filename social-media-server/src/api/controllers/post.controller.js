const {
  getAllPosts,
  fetchTaggedPosts,
  createNewPost,
  fetchPostWithId,
  editPostWithId,
  deletePostWithId,
  likePostWithId,
  sharePostWithId,
  fetchFeedPage,
  fetchPostsByTag,
  fetchMostLikedPosts,
  fetchPostByMostPopularTag,
} = require("../services/postProvider.js");

// Get all posts of a user with userId ( pagination )
exports.fetchAllPosts = async (req, res, next) => {
  const { userId, pageNo, pageLimit } = req.params;
  const loggedUser = req.user;

  try {
    const response = await getAllPosts(userId, loggedUser, pageNo, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all taggedPosts of a user with userId ( pagination )
exports.getTaggedPosts = async (req, res, next) => {
  const { userId, pageNo, pageLimit } = req.params;
  const loggedUser = req.user;

  try {
    const response = await fetchTaggedPosts(userId, loggedUser, pageNo, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const loggedUserName = req.user.username;
  const path = req.file.path;
  const postDetails = req.body;

  try {
    const response = await createNewPost(loggedUserId, loggedUserName, path, postDetails, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchPost = async (req, res, next) => {
  const loggedUser = req.user;
  const { postId } = req.params;

  try {
    const response = await fetchPostWithId(loggedUser, postId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.editPost = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { postId } = req.params;
  const path = req.file.path;
  const postDetails = req.body; 

  try {
    const response = await editPostWithId(loggedUserId, postId, postDetails, path, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { postId } = req.params;

  try {
    const response = await deletePostWithId(loggedUserId, postId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { postId } = req.params;

  try {
    const response = await likePostWithId(loggedUserId, postId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.sharePost = async (req, res, next) => {
  const loggedUserId = req.user._id;
  const { postId } = req.params;
  const postDetails = req.body;

  try {
    const response = await sharePostWithId(loggedUserId, postId, postDetails, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getFeed = async (req, res, next) => {
  let { pageNo, pageLimit } = req.params;
  const loggedUserId = req.user._id;

  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);
    const response = await fetchFeedPage(loggedUserId, offset, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getPostByTag = async (req, res, next) => {
  let { tag, pageNo, pageLimit } = req.params;

  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);
    const response = await fetchPostsByTag(tag, offset, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getPostByMostPopularTags = async (req, res, next) => {
  let { pageNo, pageLimit } = req.params;

  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);
    const response = await fetchPostByMostPopularTag(offset, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


exports.getMostLikedPosts = async (req, res, next) => {
  let { pageNo, pageLimit } = req.params;

  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);
    const response = await fetchMostLikedPosts(offset, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
