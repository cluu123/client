import api from './index';

export const getFriendData = params => api({
    url: '/tot/getFriendData',
    params,
    method: 'post'
});
