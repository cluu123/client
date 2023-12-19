
import api from './index';

export const uploadFile = '/tot/img';

export const upload = params => api({
    url: uploadFile,
    params,
    type: 'multipart/form-data',
    method: 'post'
});
