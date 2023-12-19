<template>
    <div class="customColor" id="ada">
        <Back title="系统色"/>
        <div class="customColor-c">
            <van-form ref="vanFormEl">
                <van-cell-group inset>
                    <van-field
                        v-model="form.bgColor"
                        type="color"
                        label="系统背景色"
                    />
                    <van-field
                        v-model="form.color"
                        type="color"
                        label="系统字体色"
                    />
                </van-cell-group>
            </van-form>
            <div class="set">
                <van-button type="primary" class="set-btn" @click="submit">确认修改</van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Back from '@/components/goBack';
import { reactive } from 'vue';
import { setCustomColor } from '@/lib/my';
import { useCounterStore } from '@/vuex';
import { showSuccessToast } from 'vant';

const root = document.documentElement;

const user = useCounterStore().user;
const form = reactive({
    bgColor: user.bgColor,
    color: user.color
});
console.log(form);
const submit = () => {
    root.style.setProperty('--bg1', form.color);
    setCustomColor({ uid: user.uid, ...form }).then(() => {
        showSuccessToast('修改成功');
        user.bgColor = form.bgColor;
        user.color = form.color;
        root.style.setProperty('--bg1', form.bgColor);
        root.style.setProperty('--color2', form.color);
        root.style.setProperty('--van-button-primary-color', form.color);
        root.style.setProperty('--van-button-border-width', form.bgColor);
        root.style.setProperty('--van-button-primary-background', form.bgColor);
    });
};

</script>

<style scoped lang="less">
.customColor {
    height: 100%;
    overflow: auto;
    background-color: #e3e3e3;
    &-c {
        margin: 10px 0;
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
