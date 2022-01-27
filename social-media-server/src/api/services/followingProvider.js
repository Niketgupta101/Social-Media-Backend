const Follow = require("../models/follow");
const ErrorResponse = require("../utils/errorResponse");
const ObjectId = require("mongoose").Types.ObjectId;


exports.getFollowing = async (id) => {
  try {
    const data = await Follow.find({
      follower: ObjectId(id),
      progress: "accepted",
    });

    console.log(data);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.getSentFollowRequests = async (id) => {
  try {
    const data = await Follow.find({
      follower: ObjectId(id),
      progress: "accepted",
    });

    console.log(data);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.sendFollowWithId = async (followingId, userId, next) => {
  try {
    let isFollowing = await Follow.findOne({
        follower: ObjectId(userId),
        following: ObjectId(followingId),
      });
  
      if (isFollowing && isFollowing.progress === "requested")
        return next(new ErrorResponse("follow request already sent.", 400));
  
      if (isFollowing && isFollowing.progress === "accepted")
        return next(new ErrorResponse("Already following.", 400));
  
      let isBlocked = await Follow.findOne(
        { _id: ObjectId(id) },
        { _id: 0, blockedUsers: 1 }
      );
  
      if (!isBlocked) return next(new ErrorResponse(`User doesn't exist.`, 404));
  
      let index = await isBlocked.blockedUsers.findIndex(
        (i) => i === ObjectId(userId)
      );
      if (index !== -1)
        return next(new ErrorResponse(`You are being blocked by user`, 400));
  
      await Friends.create({
        follower: ObjectId(userId),
        following: ObjectId(id),
        progress: "requested",
      });
  
      return { success: true, message: "Friend Request Sent." };
  } catch (error) {
    throw error;
  }
};

exports.unfollowUserWithId = async (followingId, userId, next) => {
  try {
    let isFollowing = await Friends.findOne({
        follower: ObjectId(userId),
        following: ObjectId(followingId),
     });
  
      if (!isFollowing) return next(new ErrorResponse(`Already not following`, 400));
  
      await isFollowing.remove();
  
      return { success: true, message: "Unfollowed successfully." };
  } catch (error) {
    throw error;
  }
};
