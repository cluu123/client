import api from './index';

export const allApply = params => api({
    url: '/tot/allApply',
    params
});

export const queryUser = params => api({
    url: '/tot/queryUser',
    params
});

export const appendFriend = params => api({
    url: '/tot/appendFriend',
    params,
    method: 'post'
});

export const reqIsFriend = params => api({
    url: '/tot/is/friend',
    params
});

export const reqIsGroup = params => api({
    url: '/tot/is/group',
    params
});

