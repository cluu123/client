<template>
    <div class="login">
        <el-form
            :rules="rules"
            :model="form"
            ref="form"
            class="form"
            label-width="80px"
        >
            <el-form-item v-if="type === 'sign'" label="头像:" prop="imgUrl">
                <UploadImg @upImg="upImg"/>
            </el-form-item>
            <template v-if="type === 'sign' && iphoneLogin">
                <el-form-item label="登陆名:" prop="uid" key="uid1">
                    <el-input v-model="form.uid" />
                </el-form-item>
            </template>
            <template v-if="iphoneLogin">
                <el-form-item label="手机号:" prop="iphone">
                    <el-input v-model="form.iphone" />
                </el-form-item>
                <el-form-item label="验证码" prop="signIdx">
                    <el-input
                        v-model="form.signIdx"
                    >
                        <template #suffix>
                            <span
                                :class="timer ? 'signIdx disSignIdx' : 'signIdx' "
                                @click="sendSignIdx"
                            >
                                {{ timer ? `${signIdxNum}s后重发` :'发送验证码' }}
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="登陆名:" prop="uid" key="uid2">
                    <el-input v-model="form.uid" />
                </el-form-item>
                <el-form-item label="密码" prop="pwd" key="pwd">
                    <el-input v-model="form.pwd" show-password/>
                </el-form-item>
            </template>
            <el-form-item class="form-custom">
                <div class="form-custom-btn">
                    <el-button type="primary" @click="enSign" v-if="type === 'sign'">确认注册</el-button>
                    <el-button type="primary" @click="enLogin" v-if="type === 'login'">登陆</el-button>
                </div>
            </el-form-item>
            <div class="signPosi">
                <el-button type="primary" link @click="changeType(type === 'login' ? 'sign' : 'login')">{{ type === 'login' ? '注册账号' : '返回登陆' }}</el-button>
            </div>
            <div class="iphoneLogin" @click="changeLoginType">
                <span>{{ iphoneLogin ? '账号' : '手机号' }}{{ type === 'sign' ? '注册' : '登陆' }}</span>
            </div>
        </el-form>
    </div>
</template>

<script>
import UploadImg from './uploadImg';
import { login, sign, sms } from '@/lib/login';
import { showSuccessToast } from 'vant';
import { ElForm, ElButton, ElInput } from 'element-plus';
import { useCounterStore } from '@/vuex';

export default {
    components: {
        UploadImg, ElForm, ElButton, ElInput
    },
    data() {
        return {
            type: 'login',
            iphoneLogin: false,
            disSignIdx: false,
            signIdxNum: 60,
            timer: null,
            form: {}
        };
    },
    computed: {
        rules() {
            const validUid = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(''));
                }
                if (!/^[a-zA-Z0-9]+$/.test(value)) {
                    callback(new Error('只能输入英文和数字'));
                }
                callback();
            };
            const rules = {
                uid: { required: true, validator: validUid },
                // user: { message: '必填', required: true },
                pwd: { required: true, message: '' },
                email: { message: '', required: true },
                iphone: { message: '', required: true },
                signIdx: { message: '', required: true }
                // imgUrl: [{ message: '必填', required: true }]
            };
            return rules;
        }
    },
    mounted() {
        window.addEventListener('keydown', this.keyDown);
        this.initForm();
        this.$nextTick(() => {
            this.$refs.form.clearValidate();
        });
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keyDown);
    },
    methods: {
        keyDown(e) {
            if (e.key === 'Enter') {
                const fn = (this.type === 'sign') ? this.enSign : this.enLogin;
                fn();
            }
        },
        sendSignIdx() {
            clearInterval(this.timer);
            this.timer = null;
            this.signIdxNum--;
            this.timer = setInterval(() => {
                if (this.signIdxNum <= 1) {
                    this.signIdxNum = 60;
                    clearInterval(this.timer);
                    this.timer = null;
                    return;
                }
                this.signIdxNum--;
            }, 1000);
            sms({ iphone: this.form.iphone }).then(() => {
                showSuccessToast('验证码发送成功');
            });
        },
        initSignIdxTimer() {
            clearInterval(this.timer);
            this.timer = null;
            this.signIdxNum = 60;
        },
        changeLoginType() {
            this.iphoneLogin = !this.iphoneLogin;
            this.initSignIdxTimer();
            this.initForm();
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            });
        },
        initForm() {
            this.form = {
                uid: '',
                // user: '',
                pwd: '',
                email: null,
                iphone: null,
                imgUrl: null,
                signIdx: null
            };
        },
        enSign() {
            this.$refs.form.validate(res => {
                if (res) {
                    const params = {
                        ...this.form,
                        type: this.iphoneLogin ? 1 : 2
                    };
                    document.cookie = 'tot=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'tot_uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    useCounterStore().user = {};
                    useCounterStore().socketId = null;
                    sign(params).then(() => {
                        showSuccessToast('注册成功!');
                        this.$router.push('/');
                    });
                }
            });
        },
        enLogin() {
            this.$refs.form.validate(res => {
                if (res) {
                    const params = {
                        ...this.form,
                        type: this.iphoneLogin ? 1 : 2
                    };
                    document.cookie = 'tot=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'tot_uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    useCounterStore().user = {};
                    useCounterStore().socketId = null;
                    login(params).then(() => {
                        console.log(11);
                        showSuccessToast('登陆成功!');
                        this.$router.push('/');
                    });
                }
            });
        },

        changeType(type) {
            this.initForm();
            this.type = type;
            this.initSignIdxTimer();
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            });
        },
        upImg(url) {
            this.form.imgUrl = url;
        }
    }
};
</script>

<style scoped lang="less">
.login {
    height: 100vh;
    // padding-top: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: linear-gradient(120deg, #f5ffae 0%, #a7e2ff 100%);

    :deep(.form) {
        width: 90%;
        padding: 40px 20px 10px;
        border-radius: 10px;
        margin: auto;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        position: relative;
        background: var(--bg3);
        box-sizing: border-box;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .el-form-item {
            width: 100%;
        }
        &-custom {
            &-btn {
                width: 100%;
                text-align: center;
                .el-button {
                    width: 60%;
                    border-radius: 20px 20px;
                }
            }
            .el-form-item__content {
                margin-left: 0 !important;
            }
        }
        .signPosi {
            position: absolute;
            top: 8px;
            right: 10px;
            text-align: right;
        }
        .iphoneLogin {
            color: #9c9c9c;
            margin-bottom: 10px;
            font-size: 14px;
            cursor: pointer;
        }
        .signIdx {
            color: #409eff;
            margin-right: 5px;
        }
        .disSignIdx {
            color: #b7b7b7;
        }
    }
}
</style>
