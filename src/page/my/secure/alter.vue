<template>
    <div class="alter">
        <Back title="修改密码"/>
        <div class="alter-c">
            <van-form ref="vanFormEl">
                <van-cell-group inset>
                    <van-field
                        v-model="form.oldPass"
                        name="oldPass"
                        :rules="[{required: true, message: ''}]"
                        label="原密码"
                        placeholder="请输入原密码"
                    />
                    <van-field
                        v-model="form.newPass"
                        name="newPass"
                        :rules="[{required: true, validator: validPass, trigger: 'submit'}]"
                        label="新密码"
                        placeholder="请输入新密码"
                    />
                    <van-field
                        v-model="form.againPass"
                        name="againPass"
                        :rules="[{required: true, validator: validPass, trigger: 'submit'}]"
                        label="再次输入"
                        placeholder="请再次输入"
                    />
                </van-cell-group>
            </van-form>

            <div class="forget" @click="toForget">
                <!-- 忘记密码 -->
            </div>
            <div class="set">
                <van-button type="primary" class="set-btn" @click="submit">确认修改</van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Back from '@/components/goBack';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast } from 'vant';
import { alterPass } from '@/lib/my';
import { useCounterStore } from '@/vuex';

const router = useRouter();
const user = useCounterStore().user;
const form = reactive({
    oldPass: '',
    newPass: '',
    againPass: ''
});

const vanFormEl = ref();

const validPass = () => form.newPass === form.againPass;

const submit = () => {
    vanFormEl.value.validate(['oldPass', 'newPass', 'againPass']).then(() => {
        const params = {
            ...form,
            uid: user.uid
        };
        alterPass(params).then(() => {
            showSuccessToast('success');
            router.back();
        });
    });
};

const toForget = () => {
    router.push('/my/forget');
};

</script>

<style lang="less" scoped>
.alter {
    width: 100%;
    height: 100%;
    background: #e3e3e3;
    position: relative;
    &-c {
        margin-top: 10px;
        .forget {
            display: inline-block;
            cursor: pointer;
            margin: 5px 0 0 20px;
            color: rgb(60, 133, 241);
        }
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
