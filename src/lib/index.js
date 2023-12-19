import axios from 'axios';
// import { Message } from 'element-ui';
import { showFailToast } from 'vant';

const api = axios.create({
    baseURL: '',
    timeout: 10000
});

api.interceptors.request.use(e => {
    if (e.method === 'post') {
        e.data = e.data || e.params;
        e.headers = {
            'Content-Type': e.type ? '' : 'application/json; charset=utf-8'
        };
        delete e.params;
    }
    return e;
});

api.interceptors.response.use(e => {
    const data = e.data;
    if (data && data.code === 0) {
        return data.data;
    }
    if (data && (data.code === 301 || data.code === 302)) {
        window.location.href = `${window.location.origin}/#/login`;
        return Promise.reject('请登录');
    }
    showFailToast(data.message);
    return Promise.reject(data.message);
}, j => {
    showFailToast(j);
    return Promise.reject(j);
});

export default api;
