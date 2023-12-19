import api from './index';

export const testFile = params => api({
    url: '/tot/test/file',
    params,
    method: 'post',
    // type: 'application/octet-stream'
    type: 'multipart/form-data'
});

export const testFile1 = (params, onUploadProgress) => api({
    url: '/tot/test/file1',
    params,
    onUploadProgress,
    method: 'post',
    // type: 'application/octet-stream'
    type: 'multipart/form-data'
});

export const upRes = params => api({
    url: '/tot/test/file1/res',
    params,
    method: 'post'
});

export const uploadFile = () => api({
    url: '/tot/test/file/end'
});

export const so = params => api({
    url: '/tot/test/so',
    params,
    method: 'post'
});
