<template>
    <div class="viewSwiperMask" v-if="showViewSwiper" @click="close">
        <div class="swiper" @click.stop>
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in viewList" :key="index">
                    <div v-if="item.type === 'img'" class="item">
                        <img :src="item.url" alt=""/>
                    </div>
                    <div v-else-if="item.type === 'video'" class="item">
                        <video
                            :src="item.url"
                            controls
                            preload="auto"
                            disablePictureInPicture
                            controlslist="nodownload noremoteplayback noplaybackrate"
                        ></video>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination" @click.stop></div>
            <div class="swiper-button-prev" @click.stop></div><!--左箭头。如果放置在swiper外面，需要自定义样式。-->
            <div class="swiper-button-next" @click.stop></div>
        </div>
        <div class="mask"></div>
        <div class="close" @click="close">
            <i class="mc-icon-close"></i>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';

export default {
    props: {
        showViewSwiper: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            swiper: null,
            viewList: []
        };
    },
    methods: {
        init(index, list) {
            if (this.swiper) {
                this.swiper.destroy();
                this.swiper = null;
            }
            this.viewList = list;
            this.$nextTick(() => {
                this.swiper = new Swiper('.swiper', {
                    autoplay: false,
                    loop: true, // 循环模式选项
                    direction: 'horizontal', // 垂直切换选项
                    autoHeight: true,
                    initialSlide: index,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                });
            });
        },
        close() {
            this.$emit('update:showViewSwiper', false);
        }
    }
};
</script>

<style scoped lang="stylus">
.viewSwiperMask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: .5;
        background: #000;
    }
    .close {
        position: absolute;
        top: 40px;
        right: 40px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 100%;
        text-align: center;
        font-size: 24px;
        color: #fff;
        background-color: #262626;
        cursor: pointer;
    }
}
.swiper {
    width 300px
    height 100%
    overflow auto

    .item {
        width: 100%;
        height: 100%;
        padding: 30px;
        img {
            width 100%
        }
        video {
            width 100%
        }
    }
    .swiper-wrapper {
        height: 100% !important;
        display: flex;
        align-items: center;
    }
    --swiper-theme-color: #ff6600;
    --swiper-navigation-color: #00ff33;
    --swiper-navigation-size: 20px;
}
.swiper-autoheight .swiper-wrapper {
    align-items: center;
}
</style>
