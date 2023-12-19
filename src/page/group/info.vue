<template>
    <div class="groupInfo">
        <Back title="群信息"/>
        <div class="groupInfo-c">
            <div class="vanGrid">
                <van-grid >
                    <van-grid-item v-for="item in listInfo" :key="item.uid">
                        <div class="vanItem">
                            <img :src="setImg(item)" alt="" class="vanItem-img"/>
                            <span class="vanItem-name">{{ item.uname }}</span>
                        </div>
                    </van-grid-item>
                    <van-grid-item class="endCard" icon="plus" text="添加" @click="appendMember"/>
                </van-grid>
            </div>
            <div class="end">
                <el-button v-if="listInfo.find(ele => ele.adminId === store.user.uid)" type="warning" @click="quit(1)">解散群聊</el-button>
                <el-button v-else type="warning" @click="quit(2)">退出群聊</el-button>
            </div>
        </div>
        <el-dialog
            v-model="show"
            :show-close="false"
            destroy-on-close
            width="80%"
        >
            <div style="text-align: center;max-height: 300px; overflow: scroll">
                <van-checkbox-group v-model="checkList">
                    <van-cell-group inset>
                        <van-cell
                            v-for="(item, index) in selectOpts"
                            clickable
                            :key="item.value"
                            :title="item.name"
                            @click="toggle(index)"
                        >
                            <template #right-icon>
                                <van-checkbox
                                    :name="item.fid"
                                    :ref="el => checkboxRefs[index] = el"
                                    @click.stop
                                />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <div style="margin-top: 10px; text-align:center">
                    <el-button type="primary" size="small" @click="appendGroup">确定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import Back from '@/components/goBack';
import { ElDialog, ElButton } from 'element-plus';
import { ref, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    getGroupUserInfo, inviteGroup, quitGroup, dissolveGroup
} from '@/lib/group';
import { getFriendData } from '@/lib/contact';
import { useCounterStore } from '@/vuex';

const route = useRoute();
const ruoter = useRouter();
const store = useCounterStore();
const groupId = route.query.groupId;

const listInfo = ref([]);
const listInfoMap = ref({});
const show = ref(false);
const checkList = ref([]);
const checkboxRefs = ref([]);
const selectOpts = ref([]);
const { proxy } = getCurrentInstance();

const appendMember = () => {
    getFriendData({ uid: store.user.uid }).then(res => {
        selectOpts.value = res.filter(ele => {
            if (listInfoMap.value[ele.fid]) {
                return false;
            }
            return true;
        });
        show.value = true;
        console.log(selectOpts);
    });
};

const appendGroup = () => {
    if (!checkList.length) {
        show.value = false;
        return;
    }
    const params = {
        groupId,
        name: listInfo.value[0].name,
        checkList: checkList.value,
        uid: store.user.uid
    };
    inviteGroup(params).then(() => {
        show.value = false;
    });
};
const quit = type => {
    const API = type === 1 ? dissolveGroup : quitGroup;
    API({ groupId, uid: store.user.uid }).then(() => {
        ruoter.push('/info');
        proxy.socket.emit('refer group', {
            uid: this.store.user.uid,
            type,
            groupId
        });
    });
};

const setImg = item => {
    if (!item.img) {
        return '';
    }
    if (item.img.includes('.')) {
        return item.img;
    }
    return `data:image/png;base64,${item.img}`;
};

getGroupUserInfo({ groupId }).then(res => {
    listInfo.value = res;
    res.forEach(ele => {
        if (!listInfoMap.value[ele.uid]) {
            listInfoMap.value[ele.uid] = true;
        }
    });
});
</script>

<style lang="less" scoped>
.groupInfo {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    &-c {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .end {
            margin: auto 0 20px 0;
            width: 100%;
            text-align: center;
            button {
                width: 80%;
                border-radius: 20px;
            }
        }
    }
}
.vanGrid {
    width: 100%;
    background: #f3ebff;
    margin-top: 10px;
    max-height: 200px;
    overflow: auto;

    :deep(.endCard .van-grid-item__content) {
        background: #ffdaaf;
    }
    .vanItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        &-img {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            margin-bottom: 3px;
        }
    }
}
:deep(.el-dialog) {
    border-radius: 10px;
}
</style>
