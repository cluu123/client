<template>
    <div class="set">
        <Back/>
        <div class="set-main">
            <div class="set-main-item" @click="toCustomColor">
                <span class="main-item-label">系统色</span>
                <van-icon name="arrow" class="main-item-to"/>
            </div>
        </div>
    </div>
</template>

<script>
import Back from '@/components/goBack';

export default {
    components: {
        Back
    },
    methods: {
        toCustomColor() {
            this.$router.push('/my/customColor');
        }
    }
};
</script>

<style lang="less" scoped>
.set {
    height: 100%;
    overflow: auto;
    background-color: #e3e3e3;
    &-main {
        margin: 0 10px;
        &-item {
            margin-top: 10px;
            width: 100%;
            height: 60px;
            background: var(--bg1);
            border-radius: 10px;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
        }
    }
}
</style>
