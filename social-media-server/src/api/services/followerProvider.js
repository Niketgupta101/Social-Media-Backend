const Follow = require("../models/follow");
const ErrorResponse = require("../utils/errorResponse");
const ObjectId = require("mongoose").Types.ObjectId;

exports.getFollowers = async (id) => {
  try {
    const data = await Follow.find({
      following: ObjectId(id),
      progress: "accepted",
    });

    console.log(data);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.getReceivedFollowRequests = async (id) => {
  try {
    const data = await Follow.find({
      following: ObjectId(id),
      progress: "requested",
    });

    console.log(data);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.approveFollowerWithId = async (followerId, userId, next) => {
  try {
    let request = await Follow.findOne({
      follower: ObjectId(followerId),
      following: ObjectId(userId),
    });

    if (!request) return next(new ErrorResponse(`No such request exist`, 404));
    if (request.progress === "accepted")
      return next(new ErrorResponse(`Already a follower`, 400));

    request.progress = "accepted";

    await request.save();

    return { success: true, message: "Follow request approved." };
  } catch (error) {
    throw error;
  }
};

exports.rejectFollowerWithId = async (followerId, userId, next) => {
  try {
    let request = await Follow.findOne({
        follower: ObjectId(followerId),
        following: ObjectId(userId),
      });
  
      if (!request) return next(new ErrorResponse(`No such request exist`, 404));
      if (request.progress === "accepted")
        return next(new ErrorResponse(`Already a follower`, 400));
  
      await request.remove();
  
      return { success: true, message: "Follow Request Rejected." };
  } catch (error) {
    throw error;
  }
};

exports.removeFollowerWithId = async (followerId, userId, next) => {
  try {
    let isFollower = await Friends.findOne({
        follower: ObjectId(followerId),
        following: ObjectId(userId),
     });
  
      if (!isFollower) return next(new ErrorResponse(`Already not a follower`, 400));
  
      await isFollower.remove();
  
      return { success: true, message: "Follower Removed." };
  } catch (error) {
    throw error;
  }
};
