import api from './index';

export const alterUserInfo = params => api({
    url: '/tot/alter/info',
    params,
    method: 'post'
});

export const alterPass = params => api({
    url: '/tot/alter/pass',
    params,
    method: 'post'
});

export const alterTelPhone = params => api({
    url: '/tot/alter/phone',
    params,
    method: 'post'
});

export const bindTelPhone = params => api({
    url: '/tot/bind/phone',
    params,
    method: 'post'
});

export const sms = params => api({
    url: '/tot/my/sms',
    params
});

export const setCustomColor = params => api({
    url: '/tot/set/color',
    params,
    method: 'post'
});
