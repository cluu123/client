import api from './index';

export const getMessage = params => api({
    url: '/tot/indexMessage',
    params
});

export const getOtoMessage = params => api({
    url: '/tot/otoMessage',
    params
});

export const setMessageStatus = params => api({
    url: '/tot/status',
    params,
    method: 'post'
});
