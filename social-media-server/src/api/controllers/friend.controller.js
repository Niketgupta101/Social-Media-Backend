const {
  getFriends,
  getFriendRequests,
  sendRequest,
  approveRequest,
  rejectRequest,
  deleteFriend,
  suggestFriends,
} = require("../services/friendProvider");

// To fetch all friends of the user with userId.
exports.fetchFriends = async (req, res, next) => {
  const { id, pageNo, pageLimit } = req.params;
  
  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);

    const response = await getFriends(id, offset, pageLimit);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchFriendRequests = async (req, res, next) => {
  const { id, pageNo, pageLimit } = req.params;

  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);

    const response = await getFriendRequests(id, offset, pageLimit);

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
  const { userId, pageLimit, pageNo } = req.params.userId;
  const { location, college_city, college_name } = req.user;

  try {
    pageNo = pageNo || 1;
    pageLimit = pageLimit || 20;
    let offset = pageLimit*(pageNo-1);
    const response = await suggestFriends(userId, location, college_name, college_city, offset, pageLimit, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
