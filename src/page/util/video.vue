<template>
    <div class="followImg">
        <div
            :id="clipboardId"
            class="clipboard"
            :style="bodyStyle"
            :ref="`paste${clipboardId}`"
            type="text"
            v-viewer
            title="点击放大"
            placeholder="微信、钉钉、QQ截图后，ctrl+v粘贴到此处"
            contenteditable="false"
            @paste.stop.prevent="pasteImg($event)"
        >
        </div>
        <div v-show="isClip && isShowDelete" class="del-btn">
            <i class="el-icon-delete" style="color: #fff;font-size: 18px" @click="clear"></i>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'FollowUploadImage',
    props: {
        bodyStyle: {
            type: Object,
            default: () => ({
                width: '100%',
                height: '392px'
            })
        },

        placeholderImg: { type: String, default: null },
        isShowDelete: { type: Boolean, default: true }
    },
    data() {
        return {
            files: [],
            isClip: false,
            clipboardId: `clipboard${Math.random()}`
        };
    },
    computed: {

    },
    mounted() {
        this.refreshHolderImg();
    },
    methods: {
        refreshHolderImg() {
            if (!!this.placeholderImg && this.placeholderImg.length > 0) {
                this.isClip = true;
                // 显示图片
                const image = new Image();
                image.src = this.placeholderImg;

                const elem = document.getElementById(this.clipboardId);
                if (!elem) {
                    return;
                }
                const imgConHeight = elem.offsetHeight;
                const imgConWidth = elem.offsetWidth;

                image.height = imgConHeight;
                image.width = imgConWidth;

                const element = document.getElementById(this.clipboardId);
                if (element && element.firstChild) {
                    // 已有占位图片， 跳过
                    return;
                }

                this.$refs[`paste${this.clipboardId}`].appendChild(image);
            }
        },
        pasteImg(e) {
            console.log(33, e.clipboardData.items[0].getAsFile());
            console.log('%c[FollowUploadImage-pasteImg]', 'color: #63ADD1');
            const cbd = e.clipboardData;
            if (!(cbd && cbd.items)) {
                return;
            }
            for (let i = 0; i < cbd.items.length; i++) {
                const item = cbd.items[i];
                // 如果内容是文件，则显示
                if (item.kind === 'file') {
                    // 获取剪切板的文件
                    const blob = item.getAsFile();
                    if (blob.size === 0) {
                        return;
                    }
                    this.files.push(blob);
                    this.isClip = true;
                    // 显示图片
                    const image = new Image();
                    image.file = blob;
                    const reader = new FileReader();
                    reader.onload = (aImg => el => {
                        aImg.src = el.target.result;
                    })(image);

                    reader.readAsDataURL(blob);

                    const elem = document.getElementById(this.clipboardId);
                    const imgConHeight = elem.offsetHeight;
                    const imgConWidth = elem.offsetWidth;

                    image.height = imgConHeight;
                    image.width = imgConWidth;

                    this.$refs[`paste${this.clipboardId}`].appendChild(image);
                    // 只取一张图片
                    break;
                }
            }
            this.$emit('change', this.files);
        },
        async finishPaste() {
            await this.$emit('setFiles', this.files);
        },
        clear() {
            this.files = [];
            const element = document.getElementById(this.clipboardId);
            if (element) {
                while (element.firstChild) {
                    if (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                }
            }
            this.isClip = false;
            this.$emit('clear');
        }
    },
    watch: {
        placeholderImg: {
            handler() {
                this.refreshHolderImg();
            },
            immediate: true
        }
    }
};
</script>

<style scoped>
.followImg {
    background-color: #fff;
    border: #bfbfbf solid 1px;
    border-radius: 5px;
    position: relative;
}

.del-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.clipboard {
    border-radius: 4px;
    overflow: auto;
    cursor: pointer;
    /* 这是设置div背景图片 如果有需要可放开*/
    /*   background: url('../../assets/task/distribution/clipboardAdd.png') no-repeat center 40%;  */
    background-size: 80px;
}

.clipboard:empty:before {
    content: attr(placeholder);
    color: #bfbfbf;
    font-size: 14px;
    position: absolute;
    top: 70%;
    font-size: 12px;
    /*left:50%;*/
    /*margin-left:-20%;*/
}
</style>
