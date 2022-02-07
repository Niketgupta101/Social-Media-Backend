const Friends = require("../models/friend");
const Users = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const User = require('../models/user');
const Notification = require('../models/notification');
const { sendMailForApproveFriendRequest, sendMailForSentFriendRequest } = require('../services/emailProvider');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getFriends = async (id, offset, pageLimit) => {
  try {
    const data = await Friends.find({
      $or: [
        { fromUser: ObjectId(id), progress: "accepted" },
        { toUser: ObjectId(id), progress: "accepted" },
      ],
    })
      .skip(offset)
      .limit(pageLimit);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.getFriendRequests = async (id, offset, pageLimit) => {
  try {
    const data = await Friends.find({
      $or: [
        { fromUser: ObjectId(id), progress: "requested" },
        { toUser: ObjectId(id), progress: "requested" },
      ],
    })
      .skip(offset)
      .limit(pageLimit);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.sendRequest = async (id, userId, next) => {
  try {
    let isFriend = await Friends.findOne({
      fromUser: ObjectId(userId),
      toUser: ObjectId(id),
    });

    if (isFriend && isFriend.progress === "requested")
      return next(new ErrorResponse("Friend request already sent.", 400));

    if (isFriend && isFriend.progress === "accepted")
      return next(new ErrorResponse("Already a friend.", 400));

    let toUser = await User.findOne(
      { _id: ObjectId(id) },
      { blockedUsers: 1, username: 1, Settings: 1, emailId: 1 }
    );

    if (!toUser) return next(new ErrorResponse(`User doesn't exist.`, 404));

    let index = await toUser.blockedUsers.findIndex(
      (i) => i === ObjectId(userId)
    );
    if (index !== -1)
      return next(new ErrorResponse(`You are being blocked by user`, 400));

    await Friends.create({
      fromUser: ObjectId(userId),
      toUser: ObjectId(id),
      progress: "requested",
    });

    // send email notification to the user whom request is sent.
    if(toUser.Settings.Notifications)
    await sendMailForSentFriendRequest(toUser.emailId, loggedUserName);

    // send in app notification to the user whom request is sent.
    let notification = {
      content: `${loggedUserName} has sent you a friend request`,
      user: toUser._id,
      typeOfNoti: 'User',
      idOfType: userId
    }
    await Notification.create(notification);    

    return { success: true, message: "Friend Request Sent." };
  } catch (error) {
    throw error;
  }
};

exports.approveRequest = async (id, userId, loggedUserName, next) => {
  try {
    let request = await Friends.findOne({
      fromUser: ObjectId(userId),
      toUser: ObjectId(id),
    });

    if (!request) return next(new ErrorResponse(`No such request exist`, 404));
    if (request.progress === "accepted")
      return next(new ErrorResponse(`Already a friend`, 400));

    request.progress = "accepted";

    await request.save();

    const friendUser = await User.findOne({ _id: ObjectId(userId) }, { username: 1, Settings: 1, emailId: 1 });

    // send email notification to the user whose request is accepted.
    if(friendUser.Settings.Notifications)
    await sendMailForApproveFriendRequest(friendUser.emailId, loggedUserName);

    // send in app notification to the user whose request is accepted.
    let notification = {
      content: `${loggedUserName} has accepted your friend request`,
      user: friendUser._id,
      typeOfNoti: 'User',
      idOfType: id
    }
    await Notification.create(notification);

    return { success: true, message: "Friend request approved." };
  } catch (error) {
    throw error;
  }
};

exports.rejectRequest = async (id, userId, next) => {
  try {
    let request = await Friends.findOne({
      fromUser: ObjectId(userId),
      toUser: ObjectId(id),
    });

    if (!request) return next(new ErrorResponse(`No such request exist`, 404));
    if (request.progress === "accepted")
      return next(new ErrorResponse(`Already a friend`, 400));

    await request.remove();

    return { success: true, message: "Friend Request Rejected." };
  } catch (error) {
    throw error;
  }
};

exports.deleteFriend = async (id, userId, next) => {
  try {
    let isFriend = await Friends.findOne({
      fromUser: ObjectId(userId),
      toUser: ObjectId(id),
    });

    if (!isFriend) return next(new ErrorResponse(`Already not a friend`, 400));

    await isFriend.remove();

    return { success: true, message: "Friend Removed." };
  } catch (error) {
    throw error;
  }
};

exports.suggestFriends = async (userId, location, college_city, college_name, offset, pageLimit, next) => {
  try {
    const friendList = await Friends.find({
      $or: [
        { fromUser: ObjectId(userId), progress: 'accepted' },
        { toUser: ObjectId(userId), progress: 'accepted' }
      ]
    }, { _id: 0, fromUser: 1, toUser: 1 });

    let friendToFriendList = [];
    for (let friend of friendList)
    {
      let friendToFriend = await Friends.find({$or: [
        { fromUser: ObjectId(friend.fromUser), progress: 'accepted' },
        { toUser: ObjectId(friend.fromUser), progress: 'accepted' },
        { fromUser: ObjectId(friend.toUser), progress: 'accepted' },
        { toUser: ObjectId(friend.toUser), progress: 'accepted' }
      ]}, { _id: 0, fromUser: 1, toUser: 1 }).toArray();

      friendToFriendList = friendToFriendList.concat(friendToFriend);
    }

    let friendToFriendIds = [];
    for(let friend of friendToFriendList)
    {
      friendToFriendIds.push(friend.fromUser);
      friendToFriendIds.push(friend.toUser);
    }
    for(let friend of friendList)
    {
      friendToFriendIds = friendToFriendIds.filter( i => i===friend.fromUser);
      friendToFriendIds = friendToFriendIds.filter( i => i===friend.toUser);
    }

    let suggestFriends = await Users.find({
        $or: [
          { _id: { $in: friendToFriendIds } },
          { location },
          { college_city },
          { college_name }
        ]
      }, { username: 1, Name: 1, emailId: 1, avatar: 1 }).skip(offset).limit(pageLimit);

    return { success: true, data: suggestFriends };
  } catch (error) {
    throw error;
  }
};
