<template>
    <div class="back">
        <van-nav-bar
            :title="title"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        >
            <template #right>
                <slot name="right"></slot>
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        onClickLeft() {
            this.$router.back();
        }
    }
};
</script>

<style scoped lang="less">
.back /deep/ .van-nav-bar__content {
    background-color: var(--bg1);
    color: var(--color2);
}
</style>
