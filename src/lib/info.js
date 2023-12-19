import api from './index';

export const getFriendInfo = params => api({
    url: '/tot/friend/info',
    params
});
