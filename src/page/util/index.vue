<template>
    <div>
        <div class="main" v-if="!$route.path.includes('item')">
            <div class="main-item" v-for="item in showItem" :key="item" @click="toMySet(item)">
                <span>{{ item }}</span>
            </div>
            <div class="main-item empty"></div>
            <div class="main-item empty"></div>
            <div class="main-item empty"></div>
            <div class="main-item empty"></div>
            <div class="main-item empty"></div>
            <div class="main-item empty"></div>
        </div>
        <router-view/>
    </div>
</template>

<script>
import Back from '@/components/goBack';

export default {
    components: {
        Back
    },
    data() {
        return {
            showItem: ['cvs1', 'cvs2', 'cvs3', 'cvs4', 'svg', 'upload', 'autoHeight', 'swiper', 'gsap', 'gsap2', 'flip', 'audioVisib', 'video']
        };
    },
    methods: {
        toMySet(item) {
            this.$router.push({ path: '/util/item', query: { item } });
        }
    }
};
</script>

<style lang="less" scoped>
.main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    color: #323030;
    &-item {
        margin-top: 10px;
        width: 40%;
        height: 50px;
        background: var(--bg1);
        border-radius: 8px;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;
        box-shadow: 2px 2px 3px 3px #f0e5ff;
    }
    .empty {
        height: 0;
        padding: 0;
        box-shadow: none;
    }
}
</style>
