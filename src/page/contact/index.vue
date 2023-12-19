<template>
    <div class="contact">
        <div class="group">
            <div class="group-item" @click="toGroupChat">
                <span>建群</span>
                <van-icon name="arrow" />
            </div>
            <div class="group-item" @click="toAllGroup">
                <span>群聊</span>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="card">
            <div class="card-c" v-for="(item, index) in friendData" :key="index" @click="toMessage(item)">
                <div class="card-c-img">
                    <!-- <img :src="`data:image/png;base64,${item.img}`" alt="" /> -->
                    <img :src="setImg(item)" alt="" />
                </div>
                <div class="card-c-item">
                    <span class="card-c-item-name">{{ item.name }}</span>
                </div>
                <div class="line"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { getFriendData } from '@/lib/contact';
import { useCounterStore } from '@/vuex';

export default {
    data() {
        return {
            // uid: this.$store.state.user.tot_uid,
            uid: useCounterStore().user.tot_uid,
            friendData: []
        };
    },
    mounted() {
        this.init();
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
        init() {
            getFriendData({ uid: this.uid }).then(res => {
                this.friendData = res;
            });
        },
        toMessage(item) {
            this.$router.push({ path: '/message', query: { fid: item.fid, img: item.img } });
        },
        toGroupChat() {
            this.$router.push('/group/append');
        },
        toAllGroup() {
            this.$router.push('/group/all');
        }
    }
};
</script>

 <style lang="less" scoped>
 .group {
    padding-bottom: 10px;
    background: #eaeaea;
    &-item {
        cursor: pointer;
        height: 50px;
        margin: 5px;
        background: var(--bg1);
        color: var(--color2);
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 10px;
        justify-content: space-between;
    }
}
.card {
    color: #000;
    &-c {
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
            width: 90%;
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
        }
        &-item {
            width: calc(100% - 60px);
            padding-left: 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            &-name {
                margin-top: 3px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
}
</style>
