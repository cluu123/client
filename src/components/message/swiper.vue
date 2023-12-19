<template>
    <div class="swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in $attrs.imgList" :key="index">
                <img :src="item.message" alt=""/>
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';

export default {
    data() {
        return {
            mySwiper: null
        };
    },
    methods: {
        init(index) {
            if (this.swiper) {
                console.log(999, index, this.swiper, this.$attrs.imgList);
                this.swiper.slideTo(index);
                return;
            }
            this.swiper = new Swiper('.swiper', {
                direction: 'horizontal', // 垂直切换选项
                loop: false, // 循环模式选项
                autoHeight: true,
                initialSlide: index
            });
        }
    }
};
</script>

<style scoped lang="less">
.swiper {
    width: 300px;
    img {
        width: 100%;
        height: 100%;
    }
}
.swiper-autoheight .swiper-wrapper {
    align-items: center;
}
</style>
