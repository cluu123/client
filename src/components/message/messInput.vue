<template>
    <div class="emitInfo">
        <div class="emitInfo-title">
            <i :class="icon.inputIcon ? 'totfont tot-yuyin emitInfo-ipt' : 'totfont tot-gengduo emitInfo-ipt'" @click="changeSpeak"></i>
            <!-- <el-input
                :autosize="{ minRows: 1.2, maxRows: 6 }"
                v-if="icon.inputIcon"
                type="textarea"
                ref="input"
                id="input"
                v-model="params.ipt"
                @blur="getLocal"
                @keydown="sendMess"
            /> -->
            <CustomInput
                ref="input"
                v-show="icon.inputIcon"
                v-model="params.ipt"
                @sendMess="sendMess"
                @userInput="userInput"
                @userBlur="userBlur"
            />
            <span
                v-show="!icon.inputIcon"
                class="emitInfo-title-speak"
                @mousedown="statrAudio"
                @mouseup="stopAudio"
                @touchstart.prevent="statrAudio"
                @touchend.prevent="stopAudio"
            >按住说话</span>
            <i class="totfont tot-Emoji" @click="changeMoreIcon('emoji')"></i>
            <span v-if="params.ipt" class="emitInfo-send" @click="sendMess">发送</span>
            <i v-else class="totfont tot-jiahao" @click="changeMoreIcon('showMore')"></i>
        </div>
        <div class="emitInfo-emoji" ref="emoji">
            <span class="emitInfo-emoji-item" @click="selectEmoji(item)" v-for="(item, index) in emoji" :key="index">
                {{ item }}
            </span>
        </div>
        <div class="emitInfo-more" ref="showMore">
            <div class="emitInfo-more-item" @click="selectMore(item.value)" v-for="(item, index) in moreList" :key="index">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </div>
        </div>
        <UpImg ref="UpImg" @sendInfo="sendInfo"/>
        <div :class="audio.audioCount ? 'audioCount active' : 'audioCount'">
            {{ audio.audioCount }}s
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import UpImg from '../upImg';
import CustomInput from '../customInput';
import { emoji, moreList } from '@/enum/message';
import { showToast } from 'vant';
import { upload } from '@/lib/pubApi';
import { base64toBlob } from '@/utils/blob';

export default {
    components: {
        CustomInput,
        UpImg
    },
    props: {
        user: {
            type: Object,
            default: () => ({})
        },
        messMainInfo: {
            type: Object,
            default: () => ({})
        },
        typeInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            emoji,
            moreList,
            showMore: false,
            fid: this.$route.query.fid,
            icon: {
                inputIcon: true,
                emoji: ''
            },
            params: {
                ipt: ''
            },
            ipt: {
                iptLocal: null,
                iptEl: null
            },
            saveHeight: {
                emoji: 300,
                showMore: 150
            },
            audio: {
                stream: null,
                audioCount: 0,
                audioTime: null,
                mediaRecorder: null,
                chunks: []
            }
        };
    },

    methods: {
        userInput() {
            this.socket.emit('user input', {
                uid: this.user.tot_uid,
                fid: this.fid
            });
        },
        userBlur() {
            this.socket.emit('user blur', {
                uid: this.user.tot_uid,
                fid: this.fid
            });
        },
        async sendMess() {
            if (!this.params.ipt) {
                return;
            }
            const upFile = {};
            let type = 0;
            const data = this.params.ipt.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/g, (match, src, idx) => {
                if (src) {
                    const blob = base64toBlob(src);
                    const fileItem = new File([blob], `${Date.now()}.png`, { type: 'image/png' });
                    const file = new FormData();
                    file.append('file', fileItem);
                    // 有文本有图片
                    type = 6;
                    upFile[idx] = {
                        file,
                        url: ''
                    };
                    return '<<<url>>>';
                }
                return '';
            });

            // eslint-disable-next-line guard-for-in
            for (const i in upFile) {
                if (upFile[i]) {
                    const file = upFile[i].file;
                    // eslint-disable-next-line no-await-in-loop
                    const url = await upload(file);
                    upFile[i].url = url;
                }
            }
            const resultData = data.replace(/(<<<url>>>)/g, (match, item, idx) => `<<<${upFile[idx].url}>>>`);
            if (this.typeInfo.type === 'group') {
                this.socket.emit('g-g message', {
                    time: dayjs().valueOf(),
                    type,
                    uid: this.user.tot_uid,
                    groupId: this.typeInfo.groupId,
                    message: resultData,
                    status: 0,
                    img: this.user.img
                });
            }
            else {
                this.socket.emit('o-o message', {
                    time: dayjs().valueOf(),
                    type,
                    uid: this.user.tot_uid,
                    fid: this.fid,
                    message: resultData,
                    status: 0
                });
            }
            this.params.ipt = '';
            this.$refs.input.customInput.innerText = this.params.ipt;
            this.icon.emoji && this.changeMoreIcon(this.icon.emoji);
            // this.visibBtnHeight();
            this.inputFocus();
            this.mainScrollBottom();
        },
        sendInfo(data) {
            // 1 图片  2 视频  3 音频  4 位置
            if (this.typeInfo.type === 'group') {
                this.socket.emit('g-g message', {
                    time: dayjs().valueOf(),
                    type: data.type,
                    uid: this.user.tot_uid,
                    groupId: this.typeInfo.groupId,
                    message: data.data,
                    status: 0,
                    img: this.user.img
                });
            }
            else {
                this.socket.emit('o-o message', {
                    time: dayjs().valueOf(),
                    type: data.type,
                    uid: this.user.tot_uid,
                    fid: this.fid,
                    message: data.data,
                    status: 0
                });
            }

            this.$refs.showMore.style.height = 0;
            this.$emit('sendInfo', {
                message: data.data,
                type: data.type
            });
        },
        selectEmoji(data) {
            const value = this.params.ipt;
            let local = this.$refs.input.local;
            this.params.ipt = `${value.slice(0, local)}${data}${value.slice(local)}`;
            this.$refs.input.customInput.innerText = this.params.ipt;
            local += 2;
            this.$refs.input.setCursorPosition(local);
            // const value = this.params.ipt;
            // this.params.ipt = `${value.slice(0, this.ipt.iptLocal)}${data}${value.slice(this.ipt.iptLocal)}`;
            // this.ipt.iptLocal += 2;
        },
        selectMore(value) {
            if (value === 1) {
                this.$refs.UpImg.$el.querySelector('.el-upload').click();
                return;
            }
            if (value === 4) {
                this.sendInfo({ type: 4 });
                return;
            }
            if (value === 2) {
                this.$emit('initVideo');
            }
        },
        changeSpeak() {
            this.icon.inputIcon = !this.icon.inputIcon;
            this.inputFocus();
        },
        inputFocus() {
            this.$nextTick(() => {
                this.$refs.input.customInput && this.$refs.input.customInput.focus();
            });
        },
        changeMoreIcon(data) {
            if (data === 'showMore') {
                this.$refs.emoji.style.transition = 'none';
                this.$refs.emoji.style.height = 0;
            }
            if (data === 'emoji') {
                this.icon.inputIcon = true;
                // this.inputFocus();
                this.$refs.showMore.style.transition = 'none';
                this.$refs.showMore.style.height = 0;
            }
            this.$refs[data].style.transition = 'all 0.5s';
            if (this.icon.emoji === data) {
                this.icon.emoji = '';
                this.$refs[data].style.height = 0;
                setTimeout(() => {
                    this.mainScrollBottom();
                }, 300);
                return;
            }
            this.icon.emoji = data;
            this.$refs[data].style.height = `${this.saveHeight[data]}px`;
            setTimeout(() => {
                this.mainScrollBottom();
            }, 300);
        },
        getLocal() {
            if (!this.ipt.iptEl) {
                this.ipt.iptEl = document.querySelector('#input');
            }
            this.$nextTick(() => {
                this.ipt.iptLocal = this.ipt.iptEl.selectionEnd;
            });
        },
        visibBtnHeight() {
            this.$nextTick(() => {
                this.$refs.showMore.style.height = 0;
                this.$refs.emoji.style.height = 0;
            });
        },
        mainScrollBottom() {
            this.$emit('mainScrollBottom');
        },
        statrAudio() {
            this.audio.audioCount = 1;
            clearInterval(this.audio.audioTime);
            this.audio.audioTime = setInterval(() => {
                this.audio.audioCount += 1;
            }, 1000);
            this.audio.chunks = [];
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.audio.stream = stream;
                    this.audio.mediaRecorder = new MediaRecorder(stream);
                    this.audio.mediaRecorder.addEventListener('dataavailable', e => {
                        // 每次有新的音频可用时将其添加到 chunks 数组中
                        this.audio.chunks.push(e.data);
                    });

                    this.audio.mediaRecorder.start();
                    // 用户授权成功，获取到音频流
                    // stream 将包含来自麦克风的音频数据
                })
                .catch(err => {
                    // 用户拒绝了授权或发生其他错误
                    showToast(err);
                });
        },
        stopAudio() {
            if (this.audio.audioCount < 2) {
                clearInterval(this.audio.audioTime);
                this.audio.audioCount = 0;
                return;
            }
            this.$nextTick(() => {
                this.audio.mediaRecorder && this.audio.mediaRecorder.stop();
                this.audio.mediaRecorder.addEventListener('stop', async () => {
                    clearInterval(this.audio.audioTime);
                    this.audio.audioCount = 0;
                    const blob = new Blob(this.audio.chunks, { type: 'audio/wav' });
                    const audioFile = new File([blob], `${Date.now()}.wav`, { type: 'audio/wav' });
                    // 创建 FormData 对象
                    const formData = new FormData();
                    formData.append('file', audioFile);
                    // 调用 upload 函数上传 FormData
                    const data = await upload(formData);
                    this.sendInfo({
                        data,
                        type: 3
                    });
                });
            });
        }
    },
    beforeUnmount() {
        this.audio.stream && this.audio.stream.getTracks().forEach(track => track.stop());
        this.audio.stream = null;
    }
};
</script>

<style lang="less" scoped>
.emitInfo {
    width: 100%;
    background: #eeecf4;
    box-sizing: border-box;
    i {
        padding: 3px 8px;
        font-size: 25px;
        cursor: pointer;
    }
    &-title {
        display: flex;
        align-items: center;
        padding: 10px 0;
        &-speak {
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none;
            user-select: none;
            flex: 1;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #b9b9b9;
            border-radius: 10px;
            cursor: pointer;
            background-color: #fff;
        }
        :deep(.el-textarea) {
            max-height: 150px;
            .el-textarea__inner {
                resize: none;
            }
        }
    }
    &-send {
        color: #f0f0f0;
        background: #169d08;
        height: 25px;
        line-height: 25px;
        padding: 5px 3px;
        margin-right: 5px;
        cursor: pointer;
        width: 60px;
        text-align: center;
        font-size: 16px;
        border-radius: 5px;
    }
    &-emoji {
        height: 0;
        overflow: auto;
        transition: all 0.3s;
        scroll-behavior: smooth;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        background: #fff;
        box-sizing: border-box;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        &-item {
            width: 15%;
            margin-top: 5px;
            font-size: 25px;
            text-align: center;
        }
    }
    &-more {
        height: 0;
        overflow: auto;
        transition: all 0.5s;
        scroll-behavior: smooth;
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        box-sizing: border-box;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        &-item {
            width: 20%;
            text-align: center;
            display: flex;
            flex-direction: column;
            i {
                font-size: 30px;
            }
            span {
                font-size: 15px;
            }
        }
    }
}
.audioCount {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #474747;
    color: #fff;
    padding: 10px 15px;
    border-radius: 10px;
    display: none;
}
.audioCount.active {
    display: block;
}
</style>
