<template>
    <div class="utilMain">
        <component :is="routeMap[ruote.query.item]"/>
    </div>
</template>

<script setup>
import cvs1 from './cvs1';
import cvs2 from './cvs2';
import cvs3 from './cvs3';
import cvs4 from './cvs4';
import autoHeight from './autoHeight';
import lineHeight from './lineHeight';
import svg from './svg';
import swiper from './swiper';
import upload from './upload';
import vue3 from './vue3';
import gsap from './gsap';
import gsap2 from './gsap2';
import flip from './flip';
import audioVisib from './audioVisib';
import waterfall from './waterfall';
import video1 from './video1';

import { useRoute } from 'vue-router';
import { markRaw } from 'vue';

const ruote = useRoute();
const routeMap = markRaw({
    cvs1,
    cvs2,
    cvs3,
    cvs4,
    autoHeight,
    lineHeight,
    svg,
    swiper,
    upload,
    vue3,
    gsap,
    gsap2,
    flip,
    audioVisib,
    waterfall,
    video1
});
</script>

<style lang="less" scoped>
.utilMain {
    height: 100%;
}
.topMain {
    height: calc(100% - 40px);
}
</style>
