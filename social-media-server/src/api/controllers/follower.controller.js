const {
  getFollowers,
  getReceivedFollowRequests,
  removeFollowerWithId,
  approveFollowerWithId,
  rejectFollowerWithId,
} = require("../services/followerProvider");

// To verify emailId
exports.fetchFollowers = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await getFollowers(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchReceivedFollowRequests = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await getReceivedFollowRequests(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.removeFollower = async (req, res, next) => {
  const followerId = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await removeFollowerWithId(followerId, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.approveFollowRequest = async (req, res, next) => {
  const followerId = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await approveFollowerWithId(followerId, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.rejectFollowRequest = async (req, res, next) => {
  const followerId = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await rejectFollowerWithId(followerId, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
