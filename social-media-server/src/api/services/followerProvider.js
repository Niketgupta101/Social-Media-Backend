const Follower = require('../models/follower');
const Following = require('../models/following');
const ErrorResponse = require('../utils/errorResponse');

exports.getFollowers = async (id) => {
    try {
        const data = await Follower.findOne({ user: id});

        console.log(data);

        return data.followers;
    } catch (error) {
        throw error;
    }
}

exports.getReceivedFollowRequests = async (id) => {
    try {
        const data = await Follower.findOne({ user: id });

        console.log(data);

        return data.receivedRequests;
    } catch (error) {
        throw error;
    }
}

exports.approveFollowerWithId = async (followerId, userId, next) => {
    try {
        const user = await Follower.findOne({ user: userId });

        const index = user.receivedRequests.findIndex(i => i.user.valueOf() === followerId);
        if(index === -1)
        next(new ErrorResponse('No such request exist to get approved.', 404));

        const follower = await Following.findOne({ user: followerId });
        if(!follower)
        next(new ErrorResponse('No user corresponding to request exist', 404));

        follower.sentRequests = follower.sentRequests.filter(i => i.user.valueOf()!==userId);
        follower.following.push({ user: userId });
        await follower.save();

        user.receivedRequests = user.receivedRequests.filter(i => i.user.valueOf()!==followerId);
        user.followers.push({ user: followerId });
        await user.save();

        return { success: true, message: 'Friend Request Approved.'};
    } catch (error) {
        throw error;
    }
}

exports.rejectFollowerWithId = async (followerId, userId, next) => {
    try {
        const user = await Follower.findOne({ user: userId });

        const index = user.receivedRequests.findIndex(i => i.user.valueOf() === followerId);
        if(index === -1)
        next(new ErrorResponse('No such request exist to get rejected.', 404));

        const follower = await Following.findOne({ user: followerId });
        if(!follower)
        next(new ErrorResponse('No user corresponding to request exist', 404));

        follower.sentRequests = follower.sentRequests.filter(i => i.user.valueOf()!==userId);
        await follower.save();

        user.receivedRequests = user.receivedRequests.filter(i => i.user.valueOf()!==followerId);
        await user.save();

        return { success: true, message: 'Friend Request Rejected.'};
    } catch (error) {
        throw error;
    }
}

exports.removeFollowerWithId = async (followerId, userId, next) => {
    try {
        const user = await Follower.findOne({ user: userId });

        const index = user.followers.findIndex(i => i.user.valueOf() === followerId);
        if(index === -1)
        next(new ErrorResponse('No such follower exist to get removed.', 404));

        const follower = await Following.findOne({ user: followerId });
        if(!follower)
        next(new ErrorResponse('No user corresponding to followerId exist', 404));

        follower.following = follower.following.filter(i => i.user.valueOf()!==userId);
        await follower.save();

        user.followers = user.followers.filter(i => i.user.valueOf()!==followerId);
        await user.save();

        return { success: true, message: 'Follower removed.'};
    } catch (error) {
        throw error;
    }
}