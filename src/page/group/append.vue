<template>
    <div class="group">
        <Back/>
        <van-cell-group inset class="van">
            <van-field v-model="groupName" label="群聊名称" placeholder="请输入"/>
        </van-cell-group>
        <div v-if="relationArr.length">
            <van-cell-group inset class="relation">
                <van-checkbox-group v-model="checked">
                    <van-checkbox :name="item.fid" v-for="item in relationArr" :key="item">
                        {{ item.name || item.fid }}
                    </van-checkbox>
                </van-checkbox-group>
            </van-cell-group>
        </div>
        <div class="submit">
            <van-button
                round
                block
                type="primary"
                native-type="submit"
                @click="submit"
            >
                确认创建
            </van-button>
        </div>
        <van-loading color="#1989fa" :class="loading ? 'loading' : 'visibLoading'"/>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { getFriendData } from '@/lib/contact';
import { createGroup } from '@/lib/group';
import { useCounterStore } from '@/vuex';
import { useRouter } from 'vue-router';
import { showSuccessToast } from 'vant';
import Back from '@/components/goBack';

const store = useCounterStore();
const groupName = ref('');
const relationArr = ref([]);
const loading = ref(false);
const checked = ref();
const router = useRouter();
const { proxy } = getCurrentInstance();

const submit = () => {
    const params = {
        uid: store.user.uid,
        name: groupName.value,
        group: checked.value
    };
    createGroup(params).then(res => {
        proxy.socket.emit('join room', {
            groupId: res,
            name: params.name,
            uid: params.group,
            joinType: 1,
            time: new Date().getTime()
        });
        showSuccessToast('success');
        router.back();
    });
};
onMounted(() => {
    loading.value = true;
    getFriendData({ uid: store.user.uid }).then(res => {
        relationArr.value = res;
    }).finally(() => {
        loading.value = false;
    });
});

</script>

<style lang="less" scoped>
.group {
    .van {
        margin-top: 10px;
    }
    .submit {
        position: fixed;
        left: 0;
        bottom: 10px;
        width: 100%;
        .van-button {
            width: 80%;
            max-width: 400px;
            margin: 0 auto;
        }
    }
    .relation {
        margin-top: 10px;
        padding: 10px;
        :deep(.van-checkbox) {
            margin: 15px 0;
        }
        :deep(.van-checkbox-label) {
            margin-left: 20px;
        }
    }
    .loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.5)
    }
    .visibLoading {
        display: none;
    }
}
</style>
