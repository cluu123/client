import api from './index';

export const createGroup = params => api({
    url: '/tot/creat/group',
    params,
    method: 'post'
});

export const getGroup = params => api({
    url: '/tot/get/group',
    params
});

export const getGroupUserInfo = params => api({
    url: '/tot/get/group/user',
    params
});

export const getGroupMessage = params => api({
    url: '/tot/group/message',
    params
});

export const getAllGroupMessage = params => api({
    url: '/tot/group/all/message',
    params
});

export const inviteGroup = params => api({
    url: '/tot/group/invite',
    params,
    method: 'post'
});

export const quitGroup = params => api({
    url: '/tot/group/quit',
    params,
    method: 'post'
});

export const dissolveGroup = params => api({
    url: '/tot/group/dissolve',
    params,
    method: 'post'
});
