import api from './index';

export const getVideo = params => api({
    url: '/tot/get/testVideo1',
    params
});
