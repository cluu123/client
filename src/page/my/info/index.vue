<template>
    <div class="userInfo">
        <Back title="个人信息">
            <template v-slot:right>
                <div class="abEdit">
                    <div v-if="banClick" @click="changeBanClick()">
                        编辑
                    </div>
                    <div v-else>
                        <span @click="changeBanClick()" style="margin-right: 10px">取消</span>
                        <span @click="changeBanClick(true)" :loading="true">保存</span>
                    </div>
                </div>
            </template>
        </Back>
        <div class="userInfo-c">
            <el-form ref="form" :model="form">
                <el-form-item>
                    <span>用户头像</span>
                    <img class="find-item-c-img" :src="setImg(form.img)" alt="" @click="upImg"/>
                    <!-- <img :src="`data:image/png;base64,${form.img}`" alt="占位图" @click="upImg"/> -->
                </el-form-item>
                <el-form-item>
                    <span>用户名</span>
                    <el-input v-model="form.name" :disabled="banClick"/>
                </el-form-item>
                <el-form-item>
                    <span>签名</span>
                    <el-input v-model="form.signaTure" :disabled="banClick"/>
                </el-form-item>
            </el-form>
            <VisibUpImg ref="UpImg" @sendImg="sendImg" :disabled="banClick"/>
        </div>
    </div>
</template>

<script>
import Back from '@/components/goBack';
import VisibUpImg from '@/components/visibUpImg.vue';
import { alterUserInfo } from '@/lib/my';
import { showSuccessToast } from 'vant';
import { useCounterStore } from '@/vuex';
import { getUserInfo } from '@/lib/login';

export default {
    components: {
        Back,
        VisibUpImg
    },
    data() {
        return {
            banClick: true,
            form: {}
        };
    },
    mounted() {
        this.initForm();
    },
    methods: {
        initForm() {
            getUserInfo({ uid: useCounterStore().user.uid }).then(res => {
                this.form = res;
            });
        },
        setImg(item) {
            if (!item) {
                return '';
            }
            if (item.includes('.')) {
                return item;
            }
            return `data:image/png;base64,${item}`;
        },
        upImg() {
            if (!this.banClick) {
                this.$refs.UpImg.$el.querySelector('.el-upload').click();
            }
        },
        sendImg(data) {
            this.form.img = data;
        },
        async changeBanClick(bool) {
            if (bool) {
                const params = {
                    ...this.form
                };
                await alterUserInfo(params);
                useCounterStore().SET_USER({
                    uid: params.uid,
                    img: params.img,
                    signaTure: params.signaTure
                });
                showSuccessToast('success');
            }
            if (!this.banClick) {
                this.initForm();
            }
            this.banClick = !this.banClick;
        }
    }
};
</script>

<style lang="less" scope>
.userInfo {
    height: 100%;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    &-c {
        padding: 0 10px;
    }
    .abEdit {
        color: #007aff;
    }
    .el-form-item {
        margin-bottom: 0;
        .el-input {
            flex: 1;
            margin-left: auto;
            outline: none;
            input {
                text-align: right;
                outline: none;
                border: none;
                background: var(--bg1);
            }
        }
        .el-input.is-disabled .el-input__inner {
            color: #606266 !important;
            // background-color: transparent !important;
        }
        .el-form-item__content {
            margin-top: 10px;
            width: 100%;
            height: 60px;
            background: var(--bg1);
            border-radius: 10px;
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            cursor: pointer;
            .el-input__wrapper {
                padding: 0;
            }
            .el-input__inner {
                padding: 0 10px;
            }
            img {
                min-width: 50px;
                height: 55px;
                margin-left: auto;
                border-radius: 10px;
            }
        }
    }
}
</style>
