<template>
    <div class="find">
        <div class="find-query" v-if="type === 1">
            <el-input class="find-query-ipt" v-model="queryFid" placeholder=""/>
            <el-button type="primary" @click="queryUser">查询</el-button>
        </div>
        <div class="find-item" v-loading="loadInfo">
            <div class="find-item-c" v-for="(item, index) in findArr" :key="index">
                <!-- <img class="find-item-c-img" src="" alt=""/> -->
                <img class="find-item-c-img" :src="setImg(item)" alt="" />
                <div class="find-item-c-con">
                    <span>{{ item.name }}</span>
                    <span>{{ item.text }}</span>
                </div>
                <el-button class="find-item-c-btn" type="success" v-if="item.type === 0" @click="changeFriendStatus(item, 1)">加好友</el-button>
                <el-button style="color: #f00" type="text" v-else-if="item.type === 1">已发送</el-button>
                <el-button style="color: #949494" type="text" v-else-if="item.type === 2">好友</el-button>
                <div v-else-if="item.type === 3" >
                    <el-button class="find-item-c-btn" type="success" @click="changeFriendStatus(item, 2)">同意</el-button>
                    <el-button class="find-item-c-btn" type="danger" @click="changeFriendStatus(item, 0)">拒绝</el-button>
                </div>
            </div>
            <div v-if="!findArr.length " class="blankInfo">
                暂无信息...
            </div>
        </div>
    </div>
</template>

<script>
import { allApply, appendFriend, queryUser } from '@/lib/find';
import { showSuccessToast } from 'vant';
import { useCounterStore } from '@/vuex';
import { ElButton } from 'element-plus';

export default {
    components: { ElButton },
    data() {
        return {
            userInfo: useCounterStore().user,
            type: Number(this.$route.query.type),
            findArr: [],
            queryFid: '',
            loadInfo: false
        };
    },
    watch: {
        $route() {
            this.type = Number(this.$route.query.type);
            if (this.type === 2) {
                this.initallApply();
            }
        }
    },
    mounted() {
        if (this.type === 2 || !this.type) {
            this.initallApply();
        }
        this.socket.on('friend apply', data => {
            console.log(111, data);
            if (data.uid !== this.userInfo.uid) {
                if (data.type === 1) {
                    console.log(3);
                    this.initallApply();
                    return;
                }
                this.queryUser();
                this.handleReqFriend();
            }
            else {
                this.handleReqFriend();
            }
        });
    },
    methods: {
        setImg(item) {
            if (!item.img) {
                return '';
            }
            if (item.img.includes('.')) {
                return item.img;
            }
            return `data:image/png;base64,${item.img}`;
        },
        handleReqFriend() {
            allApply({ uid: this.userInfo.tot_uid }).then(res => {
                const friendLen = res.filter(ele => ele.fid !== this.userInfo.uid && ele.type !== 2);
                if (friendLen.length) {
                    useCounterStore().SET_MENU_POINT(['/find'], friendLen.length);
                    return;
                }
                useCounterStore().SET_MENU_POINT(['/find'], 0);
            });
        },
        initallApply() {
            allApply({ uid: this.userInfo.tot_uid }).then(res => {
                this.findArr = res.filter(ele => ele.fid !== this.userInfo.uid);
                if (this.findArr.length) {
                    useCounterStore().SET_MENU_POINT(['/find'], this.findArr.length);
                    return;
                }
                useCounterStore().SET_MENU_POINT(['/find'], 0);
            });
        },
        changeFriendStatus(item, type) {
            const params = {
                uid: item.uid,
                fid: item.fid,
                type
            };
            appendFriend(params).then(() => {
                this.socket.emit('friend apply', {
                    uid: item.uid,
                    fid: item.fid,
                    type
                });
                showSuccessToast('success');
                if (type !== 1) {
                    this.initallApply();
                    return;
                }
                this.queryUser();
            });
        },
        queryUser() {
            if (!this.queryFid) {
                return;
            }
            this.loadInfo = true;
            const params = {
                uid: this.userInfo.tot_uid,
                keys: this.queryFid
            };
            queryUser(params).then(res => {
                this.findArr = res;
            }).finally(() => {
                this.loadInfo = false;
            });
        }
    }
};
</script>

<style scoped lang="less">
.find {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    &-query {
        display: flex;
        &-ipt {
            margin-right: 10px;
        }
    }
    &-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 10px;
        &-c {
            display: flex;
            align-items: center;
            border-radius: 10px;
            padding: 10px 5px;
            margin-bottom: 5px;
            border: 1px solid #e3e3e3;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            &-img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
            }
            &-con {
                flex: 1;
                padding: 0 10px;
                display: flex;
                flex-direction: column;
            }
            &-btn {
                padding: 5px 8px;
                height: 30px;
            }
        }
        .blankInfo {
            text-align: center;
            color: #c6c6c6;
        }
    }
}
</style>
