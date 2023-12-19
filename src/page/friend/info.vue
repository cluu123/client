<template>
    <div class="friend">
        <Back :title="$route.query.fid"/>
        <div class="head">
            <img :src="setImg(info)" alt="" class="head-img"/>
            <div class="head-right">
                <span>{{ info.name }}</span>
                <span>{{ info.nickname }}</span>
                <span>{{ info.signaTure }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Back from '@/components/goBack';
import { getFriendInfo } from '@/lib/info';
import { useCounterStore } from '@/vuex';

export default {
    components: {
        Back
    },
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        getFriendInfo({ fid: this.$route.query.fid, uid: useCounterStore().user.uid }).then(res => {
            this.info = res;
            console.log(res);
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
        }
    }
};
</script>

<style lang="less" scoped>
.friend {
    background-color: #e3e3e3;
    height: 100%;
    .head {
        display: flex;
        padding: 5px 10px;
        background-color: #fff;
        margin-top: 3px;
        border-radius: 10px;
        &-img {
            width: 60px;
            height: 60px;
            border-radius: 10px;
        }
        &-right {
            margin-left: 10px;
            padding: 3px 5px;
        }
    }
}
</style>
