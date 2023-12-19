<template>
    <!-- <el-dialog
        v-model="swpVisib"
        :show-close="false"
        width="300px"
    >
        <SwiperImg v-bind="$attrs" ref="swiperImg1"/>
    </el-dialog> -->
    <van-overlay :show="swpVisib" @click="swpVisib = false">
        <SwiperImg v-bind="$attrs" ref="swiperImg1"/>
    </van-overlay>
</template>

<script>
import { ElDialog } from 'element-plus';
import SwiperImg from './swiper';

export default {
    components: {
        SwiperImg,
        ElDialog
    },
    data() {
        return {
            index: null,
            swpVisib: false
        };
    },
    watch: {
        swpVisib: {
            handler() {
                if (this.swpVisib) {
                    this.$nextTick(() => {
                        this.$refs.swiperImg1.init(this.index);
                    });
                }
            }
        }
    },
    methods: {
        init(index) {
            this.swpVisib = true;
            this.index = index;
        }
    }
};
</script>

<style scoped lang="less">
.van-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
