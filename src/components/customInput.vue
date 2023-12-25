<template>
    <div
        class="customInput"
        ref="customInput"
        contenteditable
        @keydown.enter.exact="submit"
        @blur="getCursor"
        @input="input"
        @focus="focus"
        @click="getCursor"
        @paste.stop.prevent="pasteImg($event)"
    >
    </div>
</template>

<script setup>
import { ref } from 'vue';

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
        const innerHTML = customInput.value.innerHTML;
        emit('update:modelValue', innerHTML);
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
        customInput.value.innerHTML = '';
    }
};

const getCursor = () => {
    let caretOffset = 0;
    const element = customInput.value;
    const range1 = window.getSelection().getRangeAt(0);
    const preCaretRange = range1.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range1.endContainer, range1.endOffset);
    caretOffset = preCaretRange.toString().length;
    console.log(caretOffset);
    local.value = caretOffset;
    return caretOffset;
};

const setCursorPosition = cursorPosition => {
    const element = customInput.value;
    const range = document.createRange();
    range.setStart(element.firstChild, cursorPosition);
    range.setEnd(element.firstChild, cursorPosition);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
};

// 黏贴
const pasteImg = e => {
    const clipboardData = e.clipboardData || window.clipboardData;
    e.preventDefault(); // 阻止默认粘贴行为
    for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        // 如果内容是文件，则显示
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            const reader = new FileReader();
            const image = new Image();
            reader.onload = event => {
                const base64 = event.target.result;
                image.src = base64;

                const selection = window.getSelection();
                const oldRange = selection.getRangeAt(0);
                // 在当前光标位置插入粘贴的图片
                oldRange.deleteContents();
                oldRange.insertNode(image);
                selection.collapseToEnd();

                emit('update:modelValue', customInput.value.innerHTML);
                // // 获取光标位置
                // console.log(selection.getRangeAt(0).startOffset);
            };
            reader.readAsDataURL(blob);
        }
        else if (item.kind === 'string') {
            item.getAsString(str => {
                document.execCommand('insertText', false, str);
            });
        }
    }
};

defineExpose({
    customInput,
    local,
    setCursorPosition
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
