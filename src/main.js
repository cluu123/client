import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router, initRouters } from '@/router';
import { getUserInfo, allApply } from '@/lib/login';
import { useCounterStore } from '@/vuex';
import App from '@/page/app';
import Vant, { showSuccessToast } from 'vant';

import 'vant/lib/index.css';
import 'element-plus/dist/index.css';
// import storeDef from '@/vuex';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './style/app.less';
import './assets/font/iconfont.css';
import 'swiper/css';

import { io } from 'socket.io-client';

import click from '../webPlugin/localClick';
click(showSuccessToast);

const Vue = createApp(App);

Vue.use(createPinia());
Vue.use(router);

// Vue.use(ElementUI);
Vue.use(Vant);

const rootStore = useCounterStore();
// const router = new VueRouter({ routes });
// const store = new Vuex.Store(storeDef);

const setCustomColor = data => {
    const { bgColor, color } = data;
    const root = document.documentElement;
    // const computedStyle = getComputedStyle(root);
    // if (!bgColor || !color) {
    //     useCounterStore().user.bgColor = computedStyle.getPropertyValue('--bg1');
    //     useCounterStore().user.color = computedStyle.getPropertyValue('--color2');
    // }
    root.style.setProperty('--bg1', bgColor);
    root.style.setProperty('--color2', color);
    root.style.setProperty('--van-button-primary-color', color);
    root.style.setProperty('--van-nav-bar-icon-color', color);
    root.style.setProperty('--van-nav-bar-text-color', color);
    root.style.setProperty('--van-nav-bar-title-text-color', color);
    root.style.setProperty('--van-button-border-width', bgColor);
    root.style.setProperty('--van-button-primary-background', bgColor);
};

const getCookieMap = () => new Promise(async res => {
    const cookie = document.cookie.split(';');
    let cookieMap = {};
    cookie.forEach(ele => {
        const keyAndValue = ele.split('=');
        cookieMap[keyAndValue[0].trim()] = keyAndValue[1];
    });
    if (!rootStore.user.uid && cookieMap.tot_uid) {
        const userInfo = await getUserInfo({ uid: cookieMap.tot_uid });
        const allFriend = await allApply({ uid: cookieMap.tot_uid });
        if (allFriend.length) {
            rootStore.SET_MENU_POINT(['/find'], allFriend.length);
        }
        cookieMap = {
            tot: cookieMap.tot,
            tot_uid: cookieMap.tot_uid,
            ...userInfo
        };
    }
    res(cookieMap);
});

router.beforeEach(async (to, from, next) => {
    console.log(to.path);
    if (to.path.includes('/util')) {
        next();
        return;
    }
    const cookie = await getCookieMap();
    if (cookie && cookie.tot && cookie.tot_uid && rootStore.user.uid) {
        next();
        return;
    }
    if (cookie && cookie.tot && cookie.tot_uid) {
        rootStore.SET_USER(cookie);
        setCustomColor(cookie);
        if (!Vue.config.globalProperties.socket) {
            Vue.config.globalProperties.socket = io(process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:6868' : '/', { auth: { username: cookie.tot_uid } });
            rootStore.socket = Vue.config.globalProperties.socket;
        }
        next();
        return;
    }
    if (to.path === '/login') {
        next();
        return;
    }
    next('/login');
});
// store.commit('SET_MENU', initRouters(routes));
// store.commit('SET_USER', getCookieMap());
rootStore.SET_MENU(initRouters(router.options.routes));
// if (!Vue.config.globalProperties.socket) {
//     Vue.config.globalProperties.socket = io(process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:6868' : '/', { auth: { username: getCookieMap().tot_uid } });
// }
// eslint-disable-next-line
// new Vue({
//     el: '#app',
//     router,
//     store,
//     render: h => h(App)
// });
console.log(process);
Vue.mount('#app');
