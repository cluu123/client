import { createRouter, createWebHashHistory } from 'vue-router';
import login from '@/page/login';
import info from '@/page/info';
// import contact from '@/page/contact';
import find from '@/page/find';
import my from '@/page/my';
import message from '@/page/message';
import search from '@/page/search';
import mySet from '@/page/my/set';
import myInfo from '@/page/my/info';
import util from '@/page/util';
import show from '@/page/util/show';
import group from '@/page/group';
import append from '@/page/group/append';
import all from '@/page/group/all';
import groupMessage from '@/page/group/message';
import groupInfo from '@/page/group/info';

const routes = [
    {
        path: '/',
        redirect: '/info'
    },
    {
        path: '/login',
        component: login,
        meta: {
            bottomHide: true,
            topHide: true
        }
    },
    {
        path: '/info',
        meta: {
            name: '信息',
            icon: 'tot-homefill totfont'
        },
        component: info
    },
    {
        path: '/contact',
        meta: {
            name: '通讯录',
            icon: 'tot-wodexiao totfont'
        },
        component: () => import('@/page/contact')
    },
    {
        path: '/find',
        meta: {
            name: '发现',
            icon: 'tot-faxian totfont',
            relaName: false
        },
        component: find
    },
    {
        path: '/friend',
        component: () => import('@/page/friend'),
        children: [
            {
                path: 'info',
                component: () => import('@/page/friend/info'),
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            }
        ]
    },
    {
        path: '/my',
        component: my,
        meta: {
            name: '我的',
            icon: 'tot-homefill totfont',
            topHide: true
        },
        redirect: '/my/preView',
        children: [
            {
                path: 'preView',
                component: () => import('@/page/my/preView')
            },
            {
                path: 'set',
                meta: {
                    bottomHide: true,
                    topHide: true
                },
                component: mySet
            },
            {
                path: 'customColor',
                component: () => import('@/page/my/set/customColor'),
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'myInfo',
                component: myInfo,
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'secure',
                component: () => import('@/page/my/secure'),
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'alter',
                component: () => import('@/page/my/secure/alter'),
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'phone',
                component: () => import('@/page/my/secure/phone'),
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            }
        ]
    },
    {
        path: '/message',
        meta: {
            bottomHide: true,
            topHide: true
        },
        component: message
    },
    {
        path: '/search/:id',
        component: search,
        meta: {
            bottomHide: true,
            topHide: true
        }
    },
    {
        path: '/util',
        component: util,
        meta: {
            bottomHide: true,
            topHide: true
        },
        children: [
            {
                path: 'item',
                component: show,
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            }
        ]
    },
    {
        path: '/group',
        component: group,
        children: [
            {
                path: 'append',
                component: append,
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'all',
                component: all,
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'message',
                component: groupMessage,
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            },
            {
                path: 'info',
                component: groupInfo,
                meta: {
                    bottomHide: true,
                    topHide: true
                }
            }
        ]
    }
];

export const initRouters = routs => {
    const routersObj = [];
    for (let i = 0; i < routs.length; i++) {
        if (!routs[i].meta || !routs[i].meta.name) {
            // eslint-disable-next-line
            continue;
        }
        if (routs[i].path === '/my') {
            routersObj.push({
                path: routs[i].redirect,
                name: routs[i].meta.name,
                icon: routs[i].meta.icon,
                relaName: routs[i].meta.relaName
            });
        }
        else {
            routersObj.push({
                path: routs[i].path,
                name: routs[i].meta.name,
                icon: routs[i].meta.icon,
                relaName: routs[i].meta.relaName
            });
        }
    }
    return routersObj;
};

export const router = createRouter({
    history: createWebHashHistory(),
    routes
});

