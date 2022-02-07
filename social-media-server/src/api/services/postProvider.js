const Post = require("../models/post");
const { PostTags, PostTagsCount } = require("../models/postTags");
const User = require("../models/user");
const LikePost = require("../models/likePost");
const Friends = require("../models/friend");
const Follow = require("../models/follow");
const Notification = require('../models/notification');
const TaggedUser = require("../models/taggedUsers");
const ErrorResponse = require("../utils/errorResponse");
const { changePhoto, uploadPhoto, deletePhoto } = require("./uploadProvider");
const { sendMailForTaggedUser } = require("./emailProvider");
const ObjectId = require("mongoose").Types.ObjectId;

exports.getAllPosts = async (userId, loggedUser, pageNo, pageLimit, next) => {
  try {
    if (userId === loggedUser._id) {
      let postList = await Post.find({ postedBy: userId })
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit);
      return { success: true, postList };
    }
    const user = await User.findOne({ _id: userId });
    if (!user)
      return next(new ErrorResponse("No user exists with the given id", 404));

    if (loggedUser.Settings.privateAccount) {
      const userFriends = await Friends.findOne({ user: userId });
      const index = userFriends.findIndex(
        (i) => i.user.valueOf() === loggedUser._id
      );
      if (index === -1)
        return next(
          new ErrorResponse(`Can't fetch as user's account is private.`, 400)
        );
    }

    const postList = await Post.find({ postedBy: userId })
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit);

    return { success: true, postList };
  } catch (error) {
    return next(error);
  }
};

exports.fetchTaggedPosts = async (userId, loggedUser, pageNo, pageLimit, next) => {
  try {
    if (userId === loggedUser._id) {
      let postList = await TaggedUser.find({ userTagged: userId })
        .populate('postId')
        .populate('userTagged',{ username: 1, Name: 1, avatar: 1 })
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit);
      return { success: true, postList };
    }
    const user = await User.findOne({ _id: userId });
    if (!user)
      return next(new ErrorResponse("No user exists with the given id", 404));

    if (loggedUser.Settings.privateAccount) {
      const userFriends = await Friends.findOne({ user: userId });
      const index = userFriends.findIndex(
        (i) => i.user.valueOf() === loggedUser._id
      );
      if (index === -1)
        return next(
          new ErrorResponse(`Can't fetch as user's account is private.`, 400)
        );
    }

    const postList = await TaggedUser.find({ userTagged: userId })
      .populate('postId')
      .populate('userTagged',{ username: 1, Name: 1, avatar: 1 })
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit);

    return { success: true, postList };
  } catch (error) {
    return next(error);
  }
};

exports.createNewPost = async (loggedUserId, loggedUserName, path, postDetails, next) => {
  try {
    const { secure_url, public_id } = await uploadPhoto(path);
    
    const postData = {
      ...postDetails,
      postedBy: loggedUserId,
      Image: secure_url,
      cloudinary_id: public_id,
    };

    const newPost = await Post.create(postData);

    const tags = newPost.postTags;

    // For post tags
    for (let tag of tags) {
      let postTagcount = await PostTagsCount.findOne({ tagName: tag });
      if (!postTagcount) {
        postTagcount = await PostTagsCount.create({ tagName: tag });
      } else {
        postTagcount.set({
          numberOfPosts: postTagcount.numberOfPosts + 1,
        });
        await postTagcount.save();
      }
      await PostTags.create({
        tagName: tag,
        postId: newPost._id,
        postTagId: postTagcount._id,
      });
    }

    // For tagged users
    const users = newPost.taggedUsers;
    for(let user of users)
    {
      const isUser = await User.findOne({ _id: user },{ _id: 1, emailId: 1, Settings: 1 });
      if(!isUser)
      return { success: false, message: `No user found with id ${user}` };

      await TaggedUser.create({ postId: newPost._id, userTagged: user });

      // send email notification to the user tagged to the post
      if(isUser.Settings.Notifications)
      await sendMailForTaggedUser(isUser.emailId, newPost._id, loggedUserName);

      // send in app notification to the user tagged to the post
      let notification = {
        content: `${loggedUserName} has tagged you to his post.`,
        user: user,
        typeOfNoti: 'Post',
        idOfType: newPost._id
      }
      await Notification.create(notification);
    }

    return { success: true, postData: newPost };
  } catch (error) {
    return next(error);
  }
};

exports.fetchPostById = async (loggedUser, postId, next) => {
  try {
    let postData = await Post.findOne({ _id: postId });

    if (!postData)
      return next(new ErrorResponse("No post with given id exist.", 400));

    if (postData.postedBy === loggedUser._id)
      return { success: true, postData };

    if (loggedUser.Settings.privateAccount) {
      const userFriends = await Friends.findOne({ user: loggedUser._id });
      const index = userFriends.findIndex(
        (i) => i.user.valueOf() === loggedUser._id
      );
      if (index === -1)
        return next(
          new ErrorResponse(`Can't fetch as user's account is private.`, 400)
        );
    }

    return { success: true, postData };
  } catch (error) {
    return next(error);
  }
};

exports.editPostWithId = async ( loggedUserId, postId, postDetails, path, next) => {
  try {
    let post = await Post.findOne({ _id: postId });

    if (!post) return next(new ErrorResponse("Post not found", 404));
    if (post.postedBy.valueOf() !== loggedUserId)
      return next(new ErrorResponse("Not authorised to edit this post", 400));

    const { secure_url, public_id } = await changePhoto(
      post.cloudinary_d,
      path
    );

    post = {
      ...postDetails,
      Image: secure_url,
      cloudinary_id: public_id,
      updatedAt: Date.now(),
    };

    await post.save();

    return { success: true, postData: post };
  } catch (error) {
    return next(error);
  }
};

exports.deletePostWithId = async (loggedUserId, postId, next) => {
  try {
    let post = await Post.findOne({ _id: postId });

    if (!post) return next(new ErrorResponse("No such post found.", 404));
    if (loggedUserId !== post.postedBy.valueOf())
      return next(new ErrorResponse("Not authorised to delete this post."));

    await deletePhoto(post.cloudinary_id);

    await post.remove();

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    return next(error);
  }
};

exports.likePostWithId = async (loggedUserId, postId, next) => {
  try {
    let likePost = await LikePost.findOne({ postId, postedBy: loggedUserId });

    let post = await Post.findOne({ _id: postId }, { likeCount: 1 });

    if (!post) return next(new ErrorResponse(`No such post found.`, 404));

    if (!likePost) {
      post.likeCount = post.likeCount + 1;
      await post.save();
      await LikePost.create(likePost);
      return { success: true, message: `Post liked successfully` };
    }
    post.likeCount = post.likeCount - 1;
    await post.save();
    await likePost.remove();
    return { success: true, message: `Post unliked successfully` };
  } catch (error) {
    return next(error);
  }
};

exports.sharePostWithId = async (loggedUserId, postId, postDetails, next) => {
  try {
    let postToShare = await Post.findOne({ _id: postId });

    if (!postToShare) return next(new ErrorResponse("No such post found", 404));

    let PostToCreate = {
      ...postDetails,
      postedBy: loggedUserId,
      isShared: true,
      sharedPost: postId,
    };
    const newPost = await Post.create(PostToCreate);

    return { success: true, postData: newPost };
  } catch (error) {
    return next(error);
  }
};

exports.fetchFeedPage = async (loggedUserId, offset, pageLimit, next) => {
  try {
    const friendList = await Friends.find(
      {
        $or: [
          { fromUser: ObjectId(loggedUserId), progress: "accepted" },
          { toUser: ObjectId(loggedUserId), progress: "accepted" },
        ],
      },
      { _id: 0, toUser: 1, fromUser: 1 }
    );

    let friendsIds = [];
    for (let friend of friendList) {
      if (friend.fromUser !== ObjectId(loggedUserId))
        friendsIds.push(friend.fromUser);
      if (friend.toUser !== ObjectId(loggedUserId))
        friendsIds.push(friend.toUser);
    }

    const followList = await Follow.find(
      {
        follower: ObjectId(loggedUserId),
      },
      { _id: 0, following: 1 }
    );

    let following = followList.map((i) => i.following);

    let posts = await Post.aggregate([
      {
        $match: {
          $or: [
            { postedBy: { $in: friendsIds } },
            { postedBy: { $in: following } },
            { postedBy: ObjectId(loggedUserId) },
          ],
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: offset },
      { $limit: pageLimit },
    ]);

    return { success: true, posts };
  } catch (error) {
    return next(error);
  }
};

exports.fetchPostsByTag = async (tag, offset, pageLimit, next) => {
  console.log(tag);
  try {
    let postList = await PostTags.find({ tagName: tag })
      .populate("postId")
      .populate("postTagId")
      .skip(offset)
      .limit(pageLimit);

    return { success: true, postList };
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.fetchPostByMostPopularTag = async (offset, pageLimit, next) => {
  try {
    let postList = await PostTags.find()
      .populate("postId")
      .populate("posTagId")
      .set({ postTagCount: postTagId.numberOfPosts })
      .sort({ postTagCount: -1 })
      .skip(offset)
      .limit(pageLimit);

    return { success: true, postList };
  } catch (error) {
    next(error);
  }
};

exports.fetchMostLikedPosts = async (offset, pageLimit, next) => {
  try {
    let postList = await Post.find()
      .sort({ likeCount: -1 })
      .skip(offset)
      .limit(pageLimit);

    return { success: true, postList };
  } catch (error) {
    next(error);
  }
};
