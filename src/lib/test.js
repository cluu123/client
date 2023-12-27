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

export const getTxt = params => api({
    url: '/tot/get/testText',
    params,
    headers: {
        range: 'bytes=0-3'
    }
});

export const getCache = params => api({
    url: '/tot/get/cache',
    params
});
