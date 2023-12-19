<template>
    <div class="phone">
        <Back title="手机号"/>
        <div class="phone-c">
            <van-form ref="vanFormEl">
                <van-cell-group inset>
                    <van-field
                        v-if="info.currentPhone"
                        v-model="info.currentPhone"
                        readonly
                        type="tel"
                        name="phone"
                        label="手机号"
                    />
                    <van-field
                        v-else
                        v-model="info.phone"
                        type="tel"
                        name="phone"
                        label="手机号"
                    />
                    <van-field
                        v-if="info.currentPhone"
                        v-model="info.alterPhone"
                        type="tel"
                        name="phone"
                        label="修改手机号"
                    />
                    <van-field
                        v-model="info.signIdx"
                        center
                        clearable
                        label="短信验证码"
                        placeholder="请输入短信验证码"
                    >
                        <template #button>
                            <van-button size="small" type="primary" v-if="timer">{{ time }}</van-button>
                            <van-button size="small" type="primary" v-else @click="sendSms">发送验证码</van-button>
                        </template>
                    </van-field>
                </van-cell-group>
            </van-form>

            <div class="set">
                <van-button type="primary" class="set-btn" @click="alterPhone" v-if="info.currentPhone">修改手机号</van-button>
                <van-button type="primary" class="set-btn" @click="bindPhone" v-else>绑定手机号</van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Back from '@/components/goBack';
import { getUserInfo } from '@/lib/login';
import { useCounterStore } from '@/vuex';
import { ref, reactive } from 'vue';
import { showFailToast } from 'vant';
import { alterTelPhone, bindTelPhone, sms } from '@/lib/my';

const user = useCounterStore().user;
const info = reactive({
    phone: '', alterPhone: '', currentPhone: '', signIdx: ''
});
const timer = ref(null);
const time = ref(60);

const getUser = () => {
    getUserInfo({ uid: user.uid }).then(res => {
        info.currentPhone = res.phone;
        info.signIdx = '';
    });
};

const sendSms = async () => {
    const params = {
        phone: info.phone
    };
    await sms(params);
    timer.value = setInterval(() => {
        if (time.value === 1) {
            clearInterval(timer.value);
            timer.value = null;
            time.value = 60;
            return;
        }
        time.value--;
    }, 1000);
};
const alterPhone = () => {
    const params = {
        uid: user.uid,
        signIdx: info.signIdx,
        phone: info.currentPhone,
        alterPhone: info.alterPhone
    };
    if (!params.alterPhone) {
        showFailToast('请输入换绑手机号');
        return;
    }
    if (!params.signIdx) {
        showFailToast('请输入验证码');
        return;
    }
    alterTelPhone(params).then(() => {
        clearInterval(timer.value);
        timer.value = null;
        time.value = 60;
        getUser('修改手机号成功');
    });
};
const bindPhone = () => {
    const params = {
        uid: user.uid,
        signIdx: info.signIdx,
        phone: info.phone
    };
    if (!params.phone) {
        showFailToast('请输入手机号');
        return;
    }
    if (!params.signIdx) {
        showFailToast('请输入验证码');
        return;
    }
    bindTelPhone(params).then(() => {
        clearInterval(timer.value);
        timer.value = null;
        time.value = 60;
        getUser('绑定手机号成功');
    });
};

getUser();
</script>

<style lang="less" scoped>
.phone {
    width: 100%;
    height: 100%;
    background: #e3e3e3;
    position: relative;
    &-c {
        margin-top: 10px;
        .set {
            width: 100%;
            margin-top: 10px;
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 30px;
            left: 0;
            &-btn {
                width: 90%;
                border-radius: 20px;
            }
        }
    }
}
</style>
