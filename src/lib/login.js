import api from './index';

export const login = params => api({
    url: '/tot/login',
    params,
    method: 'post'
    // type: 'application/octet-stream'
});

export const sign = params => api({
    url: '/tot/sign',
    params,
    method: 'post'
    // type: 'application/octet-stream'
});

export const sms = params => api({
    url: '/tot/sms',
    params
});

export const getUserInfo = params => api({
    url: '/tot/user/info',
    params
});

export const allApply = params => api({
    url: '/tot/allApply',
    params
});
