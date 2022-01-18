const {
  getFriends,
  getFriendRequests,
  sendRequest,
  approveRequest,
  rejectRequest,
  deleteFriend,
  suggestFriends,
} = require("../services/friendProvider");

// To verify emailId
exports.fetchFriends = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await getFriends(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchFriendRequests = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await getFriendRequests(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.sendFriendRequest = async (req, res, next) => {
  const id = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await sendRequest(id, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.approveFriendRequest = async (req, res, next) => {
  const id = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await approveRequest(id, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.rejectFriendRequest = async (req, res, next) => {
  const id = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await rejectRequest(id, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.removeFriend = async (req, res, next) => {
  const id = req.params.userId;
  const userId = req.user._id.valueOf();
  try {
    const response = await deleteFriend(id, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.friendSuggestions = async (req, res, next) => {
  const id = req.params.userId;

  try {
    const response = await suggestFriends(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
