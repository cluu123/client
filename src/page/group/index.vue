<template>
    <div class="group">
        <router-view/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: ''
        };
    }
};
</script>

<style scoped lang="less">
.group {
    background: #f3f3f3;
    height: 100%;
}
</style>
