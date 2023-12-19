import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        menus: [],
        user: {},
        socketId: null
    }),
    actions: {
        SET_MENU(routes) {
            this.menus = routes;
        },
        SET_MENU_POINT(arr, num) {
            this.menus.forEach(ele => {
                if (arr.includes(ele.path)) {
                    ele.relaName = num;
                }
            });
        },
        SET_USER(data) {
            this.user = {
                ...this.user,
                ...data
            };
        },
        SET_SOCKET(data) {
            this.socketId = data;
        }
    }
});
