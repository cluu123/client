<template>
    <div
        class="customInput"
        ref="customInput"
        contenteditable
        @keydown.enter.exact="submit"
        @blur="getLocal"
        @input="input"
        @focus="focus"
        @paste.stop.prevent="pasteImg($event)"
    >
    </div>
</template>

<script setup>
import {
    onMounted, ref, nextTick
} from 'vue';

const props = defineProps({
    modelValue: '',
    name: ''
});

const emit = defineEmits(['update:modelValue', 'sendMess', 'userInput', 'userBlur']);
// 输入框el
const customInput = ref();
const local = ref(0);

// 输入框值改变
const input = () => {
    if (customInput.value) {
        const text = customInput.value.innerText;
        emit('update:modelValue', text);
    }
};
const focus = () => {
    emit('userInput');
};
// 发送
const submit = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        emit('sendMess', props.modelValue);
        customInput.value.innerText = '';
    }
};

// 获取光标
const getLocal = () => {
    emit('userBlur');
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        return 0;
    }
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(customInput.value);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    local.value = preSelectionRange.toString().length;
    return '';
};

// 黏贴
const pasteImg = e => {
    e.preventDefault();
    console.log(e.clipboardData);
    // const clipboardData = e.clipboardData || window.clipboardData;
    // e.preventDefault(); // 阻止默认粘贴行为
    // if (clipboardData.getData('text/plain')) {
    //     const pastedText = clipboardData.getData('text/plain'); // 获取粘贴的纯文本

    //     // 获取光标当前位置
    //     const selection = window.getSelection();
    //     const currentRange = selection.getRangeAt(0);
    //     const currentPosition = currentRange.startOffset;

    //     // 在当前位置插入粘贴的文本
    //     const textBefore = customInput.value.innerText.slice(0, currentPosition);
    //     const textAfter = customInput.value.innerText.slice(currentPosition);
    //     customInput.value.innerText = textBefore + pastedText + textAfter;

    //     // 重新设置光标位置
    //     const newPosition = currentPosition + pastedText.length;
    //     const newRange = document.createRange();
    //     const sel = window.getSelection();
    //     newRange.setStart(customInput.value.childNodes[0], newPosition);
    //     newRange.collapse(true);
    //     sel.removeAllRanges();
    //     sel.addRange(newRange);
    //     nextTick(() => {
    //         input();
    //     });
    //     return;
    // }
    // console.log(e.clipboardData, clipboardData);
    // const item = (e.clipboardData.items || e.originalEvent.clipboardData).items;
    // console.log(item.length);
    // console.log(clipboardData.getData('image'), clipboardData.getData('text'));
};

onMounted(() => {
    customInput.value.addEventListener('click', () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const offset = range.startOffset;
        local.value = offset;
        console.log(local.value);
    });
});

defineExpose({
    customInput,
    local
});
</script>

<style lang="less" scoped>
.customInput {
    flex: 1;
    min-height: 40px;
    border-radius: 10px;
    white-space: pre-wrap;
    overflow: hidden;
    overflow-y: auto;
    padding: 10px 10px;
    box-sizing: border-box;
    color: #000;
    border: 1px solid transparent;
    background: #fff;
    outline: none;
    max-height: 80px;
    &:focus {
        border-color: rgb(0, 117, 220);
    }
    &::before {
        content: "";
    }
    :deep(img) {
        width: 100px;
    }
}
</style>
