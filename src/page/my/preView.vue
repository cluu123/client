<template>
    <div class="my">
        <div class="my-top" @click="toAlterInfo">
            <div class="my-top-img">
                <img :src="setImg(info.img)" alt="" />
            </div>
            <div class="my-top-info">
                <span class="my-top-info-name">
                    <span class="my-top-info-name-label">登陆id:</span>
                    <span class="my-top-info-name-value">{{ info.uid }}</span>
                </span>
                <span class="my-top-info-name">
                    <span class="my-top-info-name-label">登录名:</span>
                    <span class="my-top-info-name-value">{{ info.name }}</span>
                </span>
                <span class="my-top-info-name">
                    <span class="my-top-info-name-label">签名:</span>
                    <span class="my-top-info-name-value">{{ info.signaTure }}</span>
                </span>
            </div>
        </div>
        <div class="my-main">
            <div class="my-main-item" @click="toSecure">
                <i class="tot-anquan totfont"></i>
                <span>账号安全</span>
            </div>
            <div class="my-main-item" @click="toMySet">
                <i class="tot-shezhi totfont"></i>
                <span>设置</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getUserInfo } from '@/lib/login';
import { useCounterStore } from '@/vuex';

export default {
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        console.log(this.$route);
        getUserInfo({ uid: useCounterStore().user.uid }).then(res => {
            this.info = res;
        });
    },
    methods: {
        setImg(item) {
            if (!item) {
                return '';
            }
            if (item.includes('.')) {
                return item;
            }
            return `data:image/png;base64,${item}`;
        },
        toMySet() {
            this.$router.push('/my/set');
        },
        toSecure() {
            this.$router.push('/my/secure');
        },
        toAlterInfo() {
            console.log(this.info);
            this.$router.push({
                path: '/my/myInfo',
                query: {
                    info: JSON.stringify(this.info)
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.my {
    padding: 10px;
    background: linear-gradient(-45deg, #ffd8ca, #ffef98);
    height: 100%;
    box-sizing: border-box;
    &-top {
        background: var(--bg1);
        border-radius: 10px;
        padding: 20px 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        display: flex;
        margin-bottom: 20px;
        &-info {
            flex: 1;
            width: 1px;
            display: flex;
            flex-direction: column;
            padding: 2px;
            &-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: flex;
                &-label {
                    display: flex;
                    margin-right: 5px;
                }
                &-value {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            &-text {
                margin-top: 5px;
            }
        }
        &-img {
            margin-right: 20px;
            width: 100px;
            flex-shrink: 0;
            img {
                border-radius: 10px;
                width: 100%;
            }
        }
    }
    &-main {
        &-item {
            margin-top: 10px;
            width: 100%;
            height: 60px;
            background: var(--bg1);
            border-radius: 10px;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }
        }
    }
    .totfont {
        margin-right: 10px;
        font-size: 20px;
    }
}
</style>
