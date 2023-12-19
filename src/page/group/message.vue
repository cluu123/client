<template>
    <div class="mainMess" v-loading="loading">
        <Back :title="route.name">
            <template #right>
                <van-icon name="ellipsis" @click="toGroupInfo" />
            </template>
        </Back>
        <MessMain
            ref="messMainEle"
            :messMainInfo="messMainInfo"
            @visibBtnHeight="visibBtnHeight"
        />
        <MessInput
            ref="messInputEle"
            :typeInfo="{
                type: 'group',
                groupId
            }"
            :user="store.user"
            @sendInfo="sendInfo"
            @mainScrollBottom="mainScrollBottom"
        />
    </div>
</template>

<script setup>
import Back from '@/components/goBack';
import MessMain from '@/components/message/messMain';
import MessInput from '@/components/message/messInput';
import dayjs from 'dayjs';
import { getGroupMessage } from '@/lib/group';
import { useCounterStore } from '@/vuex';
import { useRoute, useRouter } from 'vue-router';
import {
    onMounted, onBeforeUnmount, ref, getCurrentInstance, nextTick
} from 'vue';
import { showFailToast } from 'vant';

const { socket } = getCurrentInstance().proxy;
const store = useCounterStore();
const route = JSON.parse(useRoute().query.info);
const router = useRouter();
const groupId = route.groupId;
const loading = ref(false);
const messInputEle = ref('');
const messMainEle = ref('');
const messMainInfo = ref({
    messInfo: [],
    imgList: []
});

const mainScrollBottom = () => {
    messInputEle.value && messMainEle.value.mainScrollBottom();
};
const visibBtnHeight = () => {
    messInputEle.value && messInputEle.value.visibBtnHeight();
};
const sendInfo = data => {
    if (data) {
        messMainInfo.value.imgList.push(data);
        mainScrollBottom();
    }
};

const toGroupInfo = () => {
    router.push({ path: '/group/info', query: { groupId } });
};

const listenContextMenu = e => {
    e.preventDefault();
};

const initMessage = () => new Promise(success => {
    getGroupMessage({ groupId }).then(res => {
        messMainInfo.value.messInfo = res;
        messMainInfo.value.imgList = res.filter(ele => ele.type === 1);
        success();
    });
});

onMounted(() => {
    socket.emit('join room', {
        groupId,
        status: 0,
        uid: [store.user.uid],
        name: store.user.name,
        joinType: 0,
        time: new Date().getTime()
    });
    socket.on('error room', () => {
        showFailToast('room is already exist');
    });
    socket.on('emit room message', async data => {
        await initMessage();
        console.log(data, 11);
        messMainInfo.value.messInfo.push({
            ...data,
            status: 0,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });
        nextTick(() => {
            visibBtnHeight();
            mainScrollBottom();
        });
        console.log(messMainInfo.value.messInfo, 22);
    });
    socket.on(groupId, data => {
        messMainInfo.value.messInfo.push(data);
        nextTick(() => {
            visibBtnHeight();
            mainScrollBottom();
        });
    });
    socket.on('leave current room to client', data => {
        console.log(data, 11);
        messMainInfo.value.messInfo.push({
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            type: 0,
            uid: data.uid,
            message: `${data.name}已离线`,
            status: 0,
            img: data.img
        });
        console.log(messMainInfo.value.messInfo, 22);
    });
    document.addEventListener('contextmenu', listenContextMenu);
});

onBeforeUnmount(() => {
    socket.emit('leave current room', {
        groupId, uid: store.user.uid, time: new Date().getTime(), message: `${store.user.name}已离线`, type: -3, status: 0, name: store.user.name
    });
    document.removeEventListener('contextmenu', listenContextMenu);
});

</script>

<style lang="less" scoped>
.mainMess {
    height: 100%;
    overflow: auto;
    padding-top: 0.1px;
    box-sizing: border-box;
    background-color: #f8f8f8;
    display: flex;
    // flex-wrap: wrap;
    flex-direction: column;
}
</style>
