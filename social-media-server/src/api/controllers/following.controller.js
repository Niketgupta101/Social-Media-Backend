const {
  getFollowing,
  getSentFollowRequests,
  unfollowUserWithId,
  sendFollowWithId,
} = require("../services/followingProvider");

// To verify emailId
exports.fetchFollowing = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await getFollowing(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchSentFollowRequests = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await getSentFollowRequests(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  const followingId = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await unfollowUserWithId(followingId, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.sendFollowRequest = async (req, res, next) => {
  const followingId = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await sendFollowWithId(followingId, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
