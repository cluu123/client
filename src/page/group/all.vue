<template>
    <div>
        <Back/>
        <van-cell-group
            inset
            v-for="item in groupArr"
            :key="item.groupId"
            class="van"
            @click="toGroupMess(item)"
        >
            {{ item.name }}
        </van-cell-group>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/vuex';
import { getGroup } from '@/lib/group';
import Back from '@/components/goBack';

const store = useCounterStore();
const router = useRouter();

const groupArr = ref([]);

const toGroupMess = item => {
    console.log(item);
    router.push({ path: '/group/message', query: { info: JSON.stringify({ groupId: item.group_id }) } });
};

getGroup({ uid: store.user.uid }).then(res => {
    groupArr.value = res;
});
</script>

<style scoped lang="less">
.van {
    padding: 15px 10px;
    margin-top: 10px;
}
</style>
