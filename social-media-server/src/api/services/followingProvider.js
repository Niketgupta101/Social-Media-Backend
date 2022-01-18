const Following = require('../models/following');
const Follower = require('../models/follower')
const ErrorResponse = require('../utils/errorResponse');

exports.getFollowing = async (id) => {
    try {
        const data = await Following.findOne({ user: id});

        console.log(data);

        return data.following;
    } catch (error) {
        throw error;
    }
}

exports.getSentFollowRequests = async (id) => {
    try {
        const data = await Following.findOne({ user: id });

        console.log(data);

        return data.sentRequests;
    } catch (error) {
        throw error;
    }
}

exports.sendFollowWithId = async (followingId, userId, next) => {
    try {
        const user = await Following.findOne({ user: userId });

        const index = user.following.findIndex(i => i.user.valueOf()===followingId);
        if(index!==-1)
        return next( new ErrorResponse('Already sent a follow request.', 400));

        const followingUser = await Follower.findOne({ user: id }).populate('user','blockedUsers');
        if(!followingUser)
        return next(new ErrorResponse('No such user exist', 404));

        const isBlocked = await followingUser.user.blockedUsers.findIndex(i => i.user.valueOf()===userId);
        if(isBlocked !== -1)
        return next(new ErrorResponse("You have been blocked by user", 400));

        followingUser.receivedRequests.push({ user: userId });
        await followingUser.save();

        user.sentRequests.push({ user: followingId });
        await user.save();

        return { success: true, message: 'Follow Request Sent.'};
    } catch (error) {
        throw error;
    }
}

exports.unfollowUserWithId = async (followingId, userId, next) => {
    try {
        const user = await Following.findOne({ user: userId });

        const index = user.following.findIndex(i => i.user.valueOf() === followingId);
        if(index === -1)
        return next(new ErrorResponse('Already not following', 404));

        const followingUser = await Follower.findOne({ user: followingId });
        if(!followingUser)
        return next(new ErrorResponse('No user corresponding to followingId exist', 404));

        followingUser.followers = followingUser.followers.filter(i => i.user.valueOf()!==userId);
        await followingUser.save();

        user.following = user.following.filter(i => i.user.valueOf()!==id);
        await user.save();

        return { success: true, message: 'Unfollowed Successfully.'};
    } catch (error) {
        throw error;
    }
}
