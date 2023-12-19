<template>
    <div class="messContain" v-loading="loading">
        <div class="messContain-c" ref="messContain" @click="visibBtnHeight">
            <div
                v-for="(item, index) in messMainInfo.messInfo"
                :key="`${item.time}${index}`"
                :class="item.uid === user.uid ? 'item right' : 'item left'"
            >
                <div class="item-timer" v-if="new Date() - new Date(item.time) > 5 * 60000">
                    {{ handleTimer(item.time) }}
                </div>
                <div class="item-timer" v-if="item.type === -2">
                    {{ item.message }}
                </div>
                <div class="item-timer" v-else-if="item.type === -3">
                    {{ item.message }}
                </div>
                <div class="item-timer" v-else-if="item.type === -1">
                    {{ item.uid === user.uid ? '您' : user.uid }}撤回了一条消息
                </div>
                <div class="item-content" v-else @touchstart="getContentInfo(item)">
                    <!-- <img class="item-content-img" :src="`data:image/png;base64,${item.img}`" alt="" /> -->
                    <img class="item-content-img customClick" :src="setImg(item)" alt="" />
                    <div class="item-content-mess customClick" v-if="item.type === 0">
                        <div v-if="/^(http:\/\/|https:\/\/)/.test(item.message)" class="customClick">
                            <a :href="item.message" target="_blank">{{ item.message }}</a>
                        </div>
                        <span v-else>{{ item.message }}</span>
                    </div>
                    <div v-else-if="item.type === 1" @click="showSwpDialog(item)" class="item-content-imgMes customClick">
                        <img :src="item.message" alt=""/>
                    </div>
                    <div v-else-if="item.type === 2" class="item-content-imgMes customClick">
                        <video :src="item.message" controls preload="auto"></video>
                    </div>
                    <div v-else-if="item.type === 3" class="item-content-imgMes audio customClick" @click="playAudio(item)">
                        <i class="totfont tot-yuyinyou" v-if="item.uid === user.uid"></i>
                        <i class="totfont tot-yuyinzuo" v-else></i>
                    </div>
                    <div v-else-if="item.type === 4">
                        <Map :index="`mp_${index}`" />
                    </div>
                    <div v-else-if="item.type === 5" class="item-content-imgMes otoVideo">
                        <div v-if="item.uid === user.uid" class="otoVideo-c">
                            <i class="tot-shipin totfont turn"></i>
                            <span>{{ item.message }}</span>
                        </div>
                        <div v-if="item.uid !== user.uid" class="otoVideo-c">
                            <span>{{ item.message }}</span>
                            <i class="tot-shipin totfont"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <audio :src="audioUrl" ref="audio"></audio>
        <SwpDialog ref="swiperEle" :imgList="messMainInfo.imgList" :currentSide="swiperCurrentSide"/>
        <div class="hover" ref="tool" :style="toolInfo.tool ? setToolLocal() : ''" @click="initTool">
            <span @click="copy">复制</span>
            <span @click="recall">撤回</span>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import SwpDialog from './imgDialog';
import Map from './map';
import { useCounterStore } from '@/vuex';

export default {
    props: {
        messMainInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        SwpDialog,
        Map
    },
    data() {
        return {
            user: useCounterStore().user,
            audioUrl: '',
            audio: null,
            swiperCurrentSide: 0,
            loading: false,
            toolInfo: {
                x: 0,
                y: 0,
                tool: false,
                customClickDown: null,
                width: 100,
                height: 30,
                el: null,
                currentTagInfo: {}
            }
        };
    },
    mounted() {
        const document = this.$refs.messContain;
        document.addEventListener('contextmenu', this.moreTools);
        document.addEventListener('mousedown', this.endPress);
        // document.addEventListener('mousemove', this.endPress);
    },
    methods: {
        getContentInfo(item) {
            this.toolInfo.currentTagInfo = item;
        },
        recall() {
            const data = this.toolInfo.currentTagInfo;
            this.socket.emit('reacll o-o message', data);
        },
        copy() {
            const textarea = document.createElement('textarea');
            textarea.value = this.toolInfo.el;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        },
        initTool() {
            this.toolInfo.tool = false;
        },
        setToolLocal() {
            return `display: flex;width: ${this.toolInfo.width}px;height:${this.toolInfo.height}px; top: ${this.toolInfo.y - this.toolInfo.height}px; left:${this.toolInfo.x - this.toolInfo.width}px`;
        },
        endPress() {
            clearTimeout(this.toolInfo.customClickDown);
            this.toolInfo.tool = false;
        },
        moreTools(e) {
            this.toolInfo.customClickDown = setTimeout(() => {
                this.toolInfo.tool = false;
                console.log(e);
                if (e.target.className.includes('customClick') || e.target.parentNode.className.includes('customClick') || e.target.tagName === 'IMG') {
                    // 长按事件触发时的逻辑代码
                    if ('vibrate' in navigator) {
                        navigator.vibrate([200]);
                    }
                    this.toolInfo.tool = true;
                    this.toolInfo.x = e.pageX;
                    this.toolInfo.y = e.pageY;
                    this.toolInfo.el = e.target.tagName === 'IMG' ? e.target.src : e.target.textContent;
                }
            }, 300);
        },
        setImg(item) {
            if (!item.img) {
                return '';
            }
            if (item.img.includes('.')) {
                return item.img;
            }
            return `data:image/png;base64,${item.img}`;
        },
        showSwpDialog(item) {
            const index = this.messMainInfo.imgList.findIndex(ele => ele.message === item.message);
            this.currentSide = index;
            this.$refs.swiperEle.init(index);
        },
        handleTimer(time) {
            const now = new Date();
            const recTime = new Date(time);
            const timeLong = 24 * 3600 * 1000;
            if ((now - recTime) < timeLong) {
                return `${dayjs(time).format('HH:mm')}`;
            }
            if ((now - recTime) >= timeLong && (now - recTime) <= 2 * timeLong) {
                return `昨天 ${dayjs(time).format('HH:mm')}`;
            }
            if ((now - recTime) > 2 * timeLong && (now - recTime) <= 3 * timeLong) {
                return `前天 ${dayjs(time).format('HH:mm')}`;
            }
            return `${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}`;
        },
        mainScrollBottom() {
            const main = this.$refs.messContain;
            if (!main) {
                return;
            }
            this.loading = true;
            setTimeout(() => {
                main.scrollTo(0, main.scrollHeight);
                this.loading = false;
            }, 20);
        },
        playAudio(item) {
            if (!this.audio) {
                this.audio = this.$refs.audio;
            }
            this.audio.src = '';
            const url = item.message;
            this.audio.src = url;
            this.audio.addEventListener('canplaythrough', () => {
                this.audio.play();
            });
        }
    }
};
</script>

<style scoped lang="less">
.messContain {
    flex: 1;
    overflow: auto;
    &-c {
        height: 100%;
        overflow: auto;
    }
    .item {
        width: 100%;
        box-sizing: border-box;
        padding: 3px 5px;
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        &-timer {
            width: 100%;
            text-align: center;
            padding: 5px 0;
            font-size: 12px;
            color: #b9b9b9;
        }
        .item-content {
            width: 100%;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            &-img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
            }
            &-mess {
                max-width: calc(100% - 120px);
                min-height: 50px;
                display: flex;
                align-items: center;
                word-break: break-all;
                padding: 3px 10px;
                border-radius: 10px;
                box-sizing: border-box;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }
            &-imgMes {
                width: 200px;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                img {
                    width: 100%;
                    max-height: 200px;
                    border-radius: 10px;
                }
                video {
                    width: 100%;
                    height: 300px;
                    border-radius: 10px;
                }
            }
            &-imgMes.otoVideo {
                width: auto;
                height: 100%;
                display: flex;
                justify-content: end;
                align-items: center;
                font-size: 16px;
                background: #FFD700;
                border-radius: 10px;
                padding: 0 15px;
                .otoVideo-c {
                    display: flex;
                    align-items: center;
                    .turn {
                        transform: rotateY(180deg);
                        margin-right: 3px;
                    }
                }
            }
            &-imgMes.audio {
                width: auto;
                height: 100%;
                display: flex;
                align-items: center;
                i {
                    font-size: 20px;
                }
            }
        }
    }
    .right {
        .item-content {
            flex-direction: row-reverse;
            &-mess {
                background-color: #87CEEB;
            }
        }
    }
    .left .item-content-mess {
        background-color: #FFD700;
    }
    .hover {
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
        display: none;
        position: absolute;
        background-color: #636363;
        color: #fff;
        border-radius: 10px;
        padding: 2px 10px;
        justify-content: space-around;
        align-items: center;
    }
    a {
        text-decoration: none;
        color: #f700ff;
    }
    :deep(.amap-logo) {
        z-index: 1;
    }
}
</style>
