<template>
    <div class="main">
        <Back title="账号安全"/>
        <div class="main-c">
            <div class="main-c-item" @click="alterPassWord">
                <span class="main-item-label">改密码</span>
                <van-icon name="arrow" class="main-item-to"/>
            </div>
            <div class="main-c-item" @click="alterPhone">
                <span class="main-item-label">手机号</span>
                <van-icon name="arrow" class="main-item-to"/>
            </div>
            <div class="main-c-item custom" @click="exitLogin">
                <span>注销用户</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Back from '@/components/goBack';
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/vuex';

const router = useRouter();

const alterPassWord = () => {
    router.push('/my/alter');
};
const alterPhone = () => {
    router.push('/my/phone');
};
const exitLogin = () => {
    document.cookie = 'tot=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'tot_uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    useCounterStore().user = {};
    useCounterStore().socketId = null;

    router.push('/login');
};
</script>

<style scoped lang="less">
.main {
    width: 100%;
    min-height: calc(100% - 60px);
    background: #e3e3e3;
    &-c {
        &-item {
            height: 50px;
            background: var(--bg1);
            margin: 10px 5px;
            border-radius: 10px;
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
        }
        .custom {
            justify-content: center;
            color: var(--color2);
        }
    }
}
</style>
