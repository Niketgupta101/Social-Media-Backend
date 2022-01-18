const Friends = require('../models/friend');
const ErrorResponse = require('../utils/errorResponse');

exports.getFriends = async (id) => {
    try {
        const data = await Friends.findOne({ user: id});

        console.log(data);

        return data.friends;
    } catch (error) {
        throw error;
    }
}

exports.getFriendRequests = async (id) => {
    try {
        const data = await Friends.findOne({ user: id });

        console.log(data);

        return data.pendingRequests;
    } catch (error) {
        throw error;
    }
}

exports.sendRequest = async (id, userId, next) => {
    try {
        const user = await Friends.findOne({ user: userId });

        const index = user.friends.findIndex(i => i.user.valueOf()===id);
        if(index!==-1)
        next( new ErrorResponse('Already a friend.', 400));

        const ind = user.sentRequests.findIndex(i => i.user.valueOf()===id);
        if(ind !== -1)
        next( new ErrorResponse('Friend Request already sent', 400));

        const toUser = await Friends.findOne({ user: id });
        if(!toUser)
        next(new ErrorResponse('No such user exist', 404));

        toUser.pendingRequests.push({ user: userId });
        await toUser.save();

        user.sentRequests.push({ user: id });
        await user.save();

        return { success: true, message: 'Friend Request Sent.'};
    } catch (error) {
        throw error;
    }
}

exports.approveRequest = async (id, userId, next) => {
    try {
        const user = await Friends.findOne({ user: userId });

        const index = user.pendingRequests.findIndex(i => i.user.valueOf() === id);
        if(index === -1)
        next(new ErrorResponse('No such request exist to get approved.', 404));

        const ofUser = await Friends.findOne({ user: id });
        if(!ofUser)
        next(new ErrorResponse('No user corresponding to request exist', 404));

        ofUser.sentRequests = ofUser.sentRequests.filter(i => i.user.valueOf()!==userId);
        ofUser.friends.push({ user: userId });
        await ofUser.save();

        user.pendingRequests = user.pendingRequests.filter(i => i.user.valueOf()!==id);
        user.friends.push({ user: id });
        await user.save();

        return { success: true, message: 'Friend Request Approved.'};
    } catch (error) {
        throw error;
    }
}

exports.rejectRequest = async (id, userId, next) => {
    try {
        const user = await Friends.findOne({ user: userId });

        const index = user.pendingRequests.findIndex(i => i.user.valueOf() === id);
        if(index !== -1)
        next(new ErrorResponse('No such request exist to get rejected.', 404));

        const ofUser = await Friends.findOne({ user: id });
        if(!ofUser)
        next(new ErrorResponse('No user corresponding to request exist', 404));

        ofUser.sentRequests = ofUser.sentRequests.filter(i => i.user.valueOf()!==userId);
        await ofUser.save();

        user.pendingRequests = user.pendingRequests.filter(i => i.user.valueOf()!==id);
        await user.save();

        return { success: true, message: 'Friend Request Rejected.'};
    } catch (error) {
        throw error;
    }
}

exports.deleteFriend = async (id, userId, next) => {
    try {
        const user = await Friends.findOne({ user: userId });

        const index = user.friends.findIndex(i => i.user.valueOf() === id);
        if(index !== -1)
        next(new ErrorResponse('Already not a friend', 404));

        const ofUser = await Friends.findOne({ user: id });
        if(!ofUser)
        next(new ErrorResponse('No user corresponding to friend exist', 404));

        ofUser.sentRequests = ofUser.friends.filter(i => i.user.valueOf()!==userId);
        await ofUser.save();

        user.pendingRequests = user.friends.filter(i => i.user.valueOf()!==id);
        await user.save();

        return { success: true, message: 'Friend Removed.'};
    } catch (error) {
        throw error;
    }
}

exports.suggestFriends = async (id) => {
    try {
        const data = await Friends.findOne({ _id: id });

        return data.pendingRequests;
    } catch (error) {
        throw error;
    }
}