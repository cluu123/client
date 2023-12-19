<template>
    <div class="contain" v-loading="loading">
        <div class="card" v-for="item in list" :key="item.id" @click="toMessage(item)">
            <div class="card-img">
                <img :src="setImg(item)" alt="" />
                <span v-if="item.status === 0" class="card-img-point"></span>
            </div>
            <div class="card-item">
                <div class="card-item-top">
                    <span class="card-item-top-name">{{ item.name }}</span>
                    <span class="card-item-top-time">{{ handleTimer(Number(item.time)) }}</span>
                </div>
                <div class="card-item-text">
                    <span v-if="[-3, 0, 5].includes(item.type)">{{ item.message }}</span>
                    <span v-else-if="item.type === 1">图片</span>
                    <span v-else-if="item.type === 3">语音</span>
                </div>
            </div>
            <div class="line"></div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import { getMessage } from '@/lib/mess';
import { reqIsFriend, reqIsGroup } from '@/lib/find';
import { useCounterStore } from '@/vuex';
import { getAllGroupMessage } from '@/lib/group';

// 地图
window._AMapSecurityConfig = {
    securityJsCode: '2edd46b4db9b22ac3ca5ade1ec28586a'
};
export default {
    data() {
        return {
            user: useCounterStore().user,
            loading: false,
            list: [],
            img: ''
        };
    },
    mounted() {
        window.addEventListener('beforeunload', () => {
            this.socket.emit('o-o message save info');
            return false;
        });
        this.socket.emit('back message');
        this.socket.on('back message ready', () => {
            this.init();
        });
    },
    methods: {
        async init() {
            this.loading = true;
            const oto = await getMessage({ uid: this.user.tot_uid }).catch(() => {});
            const gtg = await getAllGroupMessage({ uid: this.user.tot_uid }).catch(() => {});
            oto.forEach(ele => {
                if (ele.uid === this.user.uid) {
                    ele.status = 1;
                }
            });
            this.list = [].concat(oto, gtg).sort((a, b) => b.time - a.time);
            this.initSocket();
            this.loading = false;
        },
        initSocket() {
            // 1v1 接受消息
            this.socket.on('o-o message', data => {
                const findItem = this.list.find(ele => {
                    if (ele.uid === data.fid && ele.fid === data.uid) {
                        ele.message = data.message;
                        ele.type = data.type;
                        ele.time = data.time;
                        ele.status = 0;
                        return true;
                    }
                    return false;
                });
                if (findItem) {
                    this.list.sort((a, b) => b.time - a.time);
                    return;
                }
                if (!findItem) {
                    reqIsFriend(data).then(res => {
                        if (res) {
                            this.list.push({
                                ...data,
                                uid: data.fid,
                                fid: data.uid
                            });
                            this.list.sort((a, b) => b.time - a.time);
                        }
                    });
                }
            });
            // 群组接受消息
            this.socket.on('info g-g message', data => {
                console.log(data, 123);
                const findItem = this.list.find(ele => {
                    if (ele.groupId === data.groupId) {
                        ele.message = data.message;
                        ele.type = data.type;
                        ele.time = data.time;
                        ele.status = 0;
                        return true;
                    }
                    return false;
                });

                if (findItem) {
                    this.list.sort((a, b) => b.time - a.time);
                    return;
                }
                if (data.tyep === -3) {
                    this.list.push({
                        ...data,
                        status: 0
                    });
                    this.list.sort((a, b) => b.time - a.time);
                    return;
                }
                if (!findItem) {
                    reqIsGroup({ groupId: data.groupId, userId: this.user.uid, formId: data.uid }).then(res => {
                        if (res) {
                            this.list.push({
                                ...data,
                                name: res[0].group_name,
                                status: 0
                            });
                            this.list.sort((a, b) => b.time - a.time);
                        }
                    });
                }
            });

            // 有人退出群聊
            this.socket.on('refer group', data => {
                this.list.filter(ele => {
                    if (ele.groupId === data.groupId) {
                        if (ele.type === 1) {
                            return false;
                        }

                        if (data.uid === this.user.uid) {
                            return false;
                        }
                    }
                    return true;
                });
            });
        },
        toMessage(item) {
            if (item.groupId) {
                this.$router.push({ path: '/group/message', query: { info: JSON.stringify(item) } });
                return;
            }
            this.$router.push({ path: '/message', query: { fid: item.fid, img: item.img } });
        },
        setImg(item) {
            if (!item.img) {
                return '';
            }
            if (item.img.includes('.')) {
                return item.img;
            }
            return `data:image/png;base64,${item.img}`;
        },
        handleTimer(time) {
            const now = new Date();
            const recTime = new Date(time);
            const timeLong = 24 * 3600 * 1000;
            if ((now - recTime) < timeLong) {
                return `${dayjs(time).format('HH:mm')}`;
            }
            if ((now - recTime) >= timeLong && (now - recTime) <= 2 * timeLong) {
                return `昨天 ${dayjs(time).format('HH:mm')}`;
            }
            if ((now - recTime) > 2 * timeLong && (now - recTime) <= 3 * timeLong) {
                return `前天 ${dayjs(time).format('HH:mm')}`;
            }
            return `${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}`;
        }
    }
};
</script>

<style scoped lang="less">
.contain {
    .card {
        display: flex;
        position: relative;
        cursor: pointer;
        height: 60px;
        padding: 0 10px;
        .line {
            background-color: #e3e3e3;
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 70%;
            height: 1px;
            transform: translateX(-50%);
        }
        &-img {
            width: 40px;
            height: 60px;
            margin-right: 5px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            img {
                width: 100%;
                height: 40px;
                border-radius: 5px;
            }
            &-point {
                width: 5px;
                height: 5px;
                background-color: #e80000;
                border-radius: 50%;
                position: absolute;
                top: 8px;
                right: -6px;
            }
        }
        &-item {
            width: calc(100% - 60px);
            padding-left: 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            &-top {
                margin-top: 3px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                &-name {
                    color: #000;
                }
                &-time {
                    font-size: 12px;
                    color: #c6c6c6;
                }
            }
            &-text {
                width: 50%;
                height: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #bababa;
                font-size: 14px;
            }
        }
    }
}
#container {
    width: 300px;
    height: 200px;
}
</style>
