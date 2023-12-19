<template>
    <div class="main" ref="main" @click.stop="showTool = false">
        <div class="main-c">
            <div class="view-top" v-if="!$route.meta.topHide">
                <i @click="back" class="tot-back totfont view-top-back"></i>
                <div class="view-top-name">tot</div>
                <div class="view-top-right">
                    <i @click="serach" class="tot-sousuo totfont view-top-right-search" v-if="$route.path === '/info'"></i>
                    <div class="view-top-right-tool" v-if="$route.path === '/info'">
                        <i class="tot-jiahao totfont" @click.stop="showTool = !showTool" ></i>
                        <div class="view-top-right-tool-select" v-if="showTool">
                            <div class="view-top-right-tool-select-c" v-for="(item, index) in options" :key="index" @click="changeItem(item)">
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contain">
                <router-view/>
            </div>
            <div class="bar" v-if="!$route.meta.bottomHide">
                <div class="bar-item" v-for="(item, index) in menus" :key="item.path" @click="toPage(item.path, index)">
                    <i :class="index === menus.findIndex(ele => ele.path === $route.path) ? `${item.icon} totfont active` : `${item.icon} totfont`"></i>
                    <span :class="index === menus.findIndex(ele => ele.path === $route.path) ? 'barName active' : 'barName'">{{ item.name }}</span>
                    <span :class="setPointClass(item)">{{ item.relaName && (item.relaName > 0) ? item.relaName : '' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useCounterStore } from '@/vuex';
import { allApply } from '@/lib/find';

export default {
    data() {
        return {
            idx: 0,
            store: useCounterStore(),
            menus: useCounterStore().menus,
            options: [
                {
                    name: '添加好友',
                    value: 1
                },
                {
                    name: '新的朋友',
                    value: 2
                }
            ],
            value: '',
            showTool: false
        };
    },
    watch: {
        'store.socket': function () {
            this.socket.on('login', data => {
                // this.$store.commit('SET_SOCKET', data);
                useCounterStore().SET_SOCKET(data);
            });
            this.socket.on('friend apply', data => {
                if ((this.$route.path !== '/find') && ((data.fid === this.store.user.uid) || (data.uid === this.store.user.uid))) {
                    allApply({ uid: this.store.user.tot_uid }).then(res => {
                        const friendLen = res.filter(ele => ele.fid !== this.store.user.uid);
                        if (friendLen.length) {
                            useCounterStore().SET_MENU_POINT(['/find'], friendLen.length);
                            return;
                        }
                        useCounterStore().SET_MENU_POINT(['/find'], 0);
                    });
                }
            });
        }
    },
    mounted() {
        console.log(process.env.NODE_ENV);
        const nav = window.navigator.userAgent;
        if (nav.includes('Mobile')) {
            this.$refs.main.style.width = '100%';
        }
    },
    methods: {
        setPointClass(item) {
            if (!item.relaName) {
                return '';
            }
            if (item.relaName < 0) {
                return 'point';
            }
            if (item.relaName > 0) {
                return 'numPoint';
            }
            return '';
        },
        toPage(path, index) {
            if (path === '/find') {
                this.$router.push({ path: '/find', query: { type: 2 } });
                return;
            }
            if (path === this.$route.path) {
                return;
            }
            this.idx = index;
            this.$router.push(path);
        },
        back() {
            this.$router.back();
        },
        serach() {
            this.$router.push('/search/2');
        },
        changeItem(item) {
            this.$router.push({ path: '/find', query: { type: item.value } });
        }
    }
};
</script>

<style scoped lang="less">
.main {
    width: 500px;
    height: 100vh;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    &-c {
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .view-top {
            width: 100%;
            cursor: pointer;
            height: 40px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e3e3e3;
            background: var(--bg1);
            &-back {
                width: 60px;
                font-size: 25px;
            }
            &-name {
                flex: 1;
                text-align: center;
            }
            &-right {
                width: 60px;
                display: flex;
                box-sizing: border-box;
                padding-right: 10px;
                &-tool {
                    position: relative;
                    width: 30px;
                    &-select {
                        position: absolute;
                        right: 0;
                        top: 27px;
                        cursor: pointer;
                        z-index: 99;
                        width: 80px;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                        background-color: #fff;
                        border: 1px solid #e3e3e3;
                        padding: 10px;
                        text-align: center;
                        color: #7c7c7c;
                        &-c {
                            padding: 3px 0;
                        }
                    }
                }
                &-search {
                    width: 50px;
                }
            }
        }
        .contain {
            flex: 1;
            width: 100%;
            overflow: auto;
        }
        .bar {
            background-color: var(--bg1);
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            &-item {
                width: 25%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                cursor: pointer;
                .barIcon {
                    margin-bottom: 3px;
                }
                .barName {
                    font-size: 12px;
                }
                .active {
                    color: var(--color3);
                }
            }
            .point {
                &:before {
                    content: "";
                    width: 5px;
                    height: 5px;
                    background: #ff32e6;
                    position: absolute;
                    right: 30px;
                    top: 8px;
                    border-radius: 100%;
                }
            }
            .numPoint {
                background: #ff32e6;
                border-radius: 100%;
                padding: 5px;
                color: #fff;
                position: absolute;
                right: 20px;
                top: 0px;
                font-size: 12px;
                transform: scale(0.7);
                width: 10px;
                height: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
@media (max-width: 768px) {
    .main {
        width: 100%;
    }
}
</style>
