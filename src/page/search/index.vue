<template>
    <div>
        <Back title="搜索"/>
        <form action="/">
            <van-search
                v-model="value"
                show-action
                placeholder="请输入搜索关键词"
                @search="onSearch"
                @cancel="onCancel"
            />
        </form>
        <div class="result">
            <div class="result-item" v-for="item in queryData" :key="item.uid">
                <img :src="item.img" alt="" class="result-item-img"/>
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Back from '@/components/goBack';

export default {
    components: { Back },
    data() {
        return {
            value: ''
        };
    },
    methods: {
        onSearch() {

        },
        onCancel() {
            this.$router.back();
        }
    }
};
</script>

<style scoped lang="less">
.result {
    &-c {
        &-img {

        }
    }
}
</style>
