const {
  verifyEmailService,
  fetchAllUsers,
  fetchUserWithId,
  editUserWithId,
  fetchUsersWithInfo,
  removeUserWithId,
  blockUserWithId,
  unblockUserWithId
} = require("../services/userProvider");

// To verify emailId
exports.verifyEmail = async (req, res, next) => {
  const emailVerifyToken = req.params.verifyToken;

  try {
    const response = await verifyEmailService(emailVerifyToken, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.changeAvatar = async (req, res, next) => {
  const id = req.params.id;

  try {
    const response = await updateAvatar(id);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.blockUser = async (req, res, next) => {
  const id = req.params.userId;
  const userId = req.user._id.valueOf();

  try {
    const response = await blockUserWithId(id, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

exports.unblockUser = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.user._id.valueOf();

  try {
    const response = await unblockUserWithId(id, userId, next);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

// fetch user with the user id passed as a param
//  -> If the userId passed matches with the id of the currently logged user then return the complete info of the user
//  -> else return the info of the user that is not set as private
exports.fetchUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const _id = req.headers.authorization.split(" ")[1];
    const data = await fetchUserWithId(userId, _id);

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// To update the details of the user with the given user Id.
exports.editUser = async (req, res, next) => {
  const updatedDetails = req.body;
  const _id = req.params.id;

  try {
    const updatedUser = await editUserWithId(updatedDetails, _id);

    res.status(201).json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.searchUsers = async (req, res, next) => {
  const info = req.params.info;
  let pagelimit = req.params.pagelimit || 20;
  let pageno = req.params.pageno || 1;

  try {
    const users = await fetchUsersWithInfo(info, pagelimit, pageno, next);

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    await removeUserWithId(id);

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
