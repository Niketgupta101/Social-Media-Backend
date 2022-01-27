const Post = require("../models/post");
const User = require("../models/user");
const LikePost = require("../models/likePost");
const Friends = require("../models/friend");
const Follow = require("../models/follow");
const ErrorResponse = require("../utils/errorResponse");
const { changePhoto, uploadPhoto, deletePhoto } = require("./uploadProvider");
const ObjectId = require('mongoose').Types.ObjectId;

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
        const index = userFriends.findIndex(i => i.user.valueOf()===loggedUser._id);
        if(index===-1)
        return next(new ErrorResponse(`Can't fetch as user's account is private.`, 400));
    }

    const postList = await Post.find({ postedBy: userId })
      .skip((pageNo - 1) * pageLimit)
      .limit(pageLimit);

    return { success: true, postList };
  } catch (error) {
    return next(error);
  }
};

exports.createNewPost = async (loggedUserId, path, postDetails, next) => {
    try {
        const { secure_url, public_id } = await uploadPhoto(path);
        
        const postData = {
            ...postDetails,
            postedBy: loggedUserId,
            Image: secure_url,
            cloudinary_id: public_id
        }

        const newPost = await Post.create(postData);

        return { success: true, postData: newPost };
    } catch (error) {
        return next(error);
    }
}

exports.fetchPostById = async (loggedUser, postId, next) => {
    try {
        let postData = await Post.findOne({ _id: postId });

        if(!postData) return next(new ErrorResponse("No post with given id exist.", 400));

        if (postData.postedBy === loggedUserId._id) 
            return { success: true, postData };

        if (loggedUser.Settings.privateAccount) {
            const userFriends = await Friends.findOne({ user: userId });
            const index = userFriends.findIndex(i => i.user.valueOf()===loggedUser._id);
            if(index===-1)
            return next(new ErrorResponse(`Can't fetch as user's account is private.`, 400));
        }
    
        return { success: true, postData };
    } catch (error) {
        return next(error);
    }
}

exports.editPostWithId = async (loggedUserId, postId, postDetails, path, next) => {
    try {
        let post = await Post.findOne({ _id: postId });

        if(!post) return next(new ErrorResponse("Post not found", 404));
        if(post.postedBy.valueOf() !== loggedUserId )
        return next(new ErrorResponse("Not authorised to edit this post", 400));

        const { secure_url, public_id } = await changePhoto(post.cloudinary_d,path);

        post = {
            ...postDetails,
            Image: secure_url,
            cloudinary_id: public_id,
            updatedAt: Date.now()
        }

        await post.save();

        return { success: true, postData: post };
    } catch (error) {
        return next(error);
    }
} 

exports.deletePostWithId = async (loggedUserId, postId, next) => {
    try {
        let post = await Post.findOne({ _id: postId });

        if(!post) return next(new ErrorResponse("No such post found.", 404));
        if(loggedUserId !== post.postedBy.valueOf())
        return next(new ErrorResponse("Not authorised to delete this post."));

        await deletePhoto(post.cloudinary_id);

        await post.remove();

        return { success: true, message: "Post deleted successfully" };
    } catch (error) {
        return next(error);
    }
}

exports.likePostWithId = async (loggedUserId, postId, next) => {
    try {
        let likePost = await LikePost.findOne({ postId, postedBy: loggedUserId});
        
        let post = await Post.findOne({ _id: postId },{ likeCount: 1});

        if(!post) return next(new ErrorResponse(`No such post found.`, 404));

        if(!likePost)
        {
            post.likeCount = post.likeCount + 1;
            await post.save();
            await LikePost.create(likePost);
            return { success: true, message: `Post liked successfully`};
        }
        post.likeCount = post.likeCount - 1;
        await post.save();
        await likePost.remove();
        return { success: true, message: `Post unliked successfully`};
    } catch (error) {
        return next(error);
    }
}

exports.sharePostWithId = async (loggedUserId, postId, postDetails, next) => {
    try {
        let postToShare = await Post.findOne({ _id: postId });

        if(!postToShare) return next(new ErrorResponse("No such post found", 404));

        let PostToCreate = {
            ...postDetails,
            postedBy: loggedUserId,
            isShared: true,
            sharedPost: postId
        }
        const newPost = await Post.create(PostToCreate);

        return { success: true, postData: newPost };
    } catch (error) {
        return next(error);
    }
}

exports.fetchFeedPage = async (loggedUserId, offset, pageLimit, next) => {
    try {
        const friendList = await Friends.find({
            $or: [
            { fromUser: ObjectId(loggedUserId), progress: "accepted" },
            { toUser: ObjectId(loggedUserId), progress: "accepted" },
            ],
        }, { _id: 0, toUser: 1, fromUser: 1 });
    
        let friendsIds = [];
        for(let friend of friendList)
        {
            if(friend.fromUser !== ObjectId(loggedUserId))
            friendsIds.push(friend.fromUser);
            if(friend.toUser !== ObjectId(loggedUserId))
            friendsIds.push(friend.toUser);
        }

        const followList = await Follow.find({
            follower: ObjectId(loggedUserId)
        }, { _id: 0, following: 1 });
    
        let following = followList.map((i) => i.following);

        let posts = await Post.aggregate([
            {
                $match: {
                    $or: [
                        { postedBy: { $in: friendsIds }},
                        { postedBy: { $in: following }},
                        { postedBy: ObjectId(loggedUserId) }
                    ]
                }
            },
            { $sort: { updatedAt: -1 } },
            { $skip: offset },
            { $limit: pageLimit }
        ]);

        return { success: true, posts };
    } catch (error) {
        return next(error);
    }
}