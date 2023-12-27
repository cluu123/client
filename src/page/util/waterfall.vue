<template>
    <div class="contain" ref="contain">
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { imgList } from './utils';

const contain = ref(null);

const children = ref([]);
const elWidth = ref(80);
const margin = ref(null);
// const arr = ref([require('@/assets/1.jpg'), require('@/assets/2.png'), require('@/assets/3.jpg'), require('@/assets/4.jpg'), require('@/assets/5.jpg')]);
const widthArr = ref([]);

const idx = ref(0);

const calcArray = el => {
    for (let i = idx.value; i < el.length; i += 1) {
        const img = document.createElement('img');
        if (i >= widthArr.value.length) {
            const min = widthArr.value.findIndex(ele => ele === Math.min(...widthArr.value));
            img.src = el[i].url;
            img.style.width = `${elWidth.value}px`;
            img.style.height = `${children.value[i]}px`;
            img.style.position = 'absolute';
            img.style.left = `${min * elWidth.value + min * margin.value}px`;
            img.style.top = `${widthArr.value[min]}px`;
            widthArr.value[min] += children.value[i];
            contain.value.appendChild(img);
        }
        else {
            img.src = el[i].url;
            img.style.width = `${elWidth.value}px`;
            img.style.height = `${children.value[i]}px`;
            img.style.position = 'absolute';
            if (i % el.length === 0) {
                img.style.left = '0';
            }
            else {
                img.style.left = `${i * elWidth.value + margin.value * i}px`;
            }
            img.style.top = 0;
            widthArr.value[i] += children.value[i];
        }
        contain.value.appendChild(img);
    }
};

const preLoad = list => new Promise(res => {
    const arrList = [];
    for (let i = 0; i < list.length; i += 1) {
        const img = new Image();
        img.src = list[i].url;
        img.onload = () => {
            arrList.push(img.height);
            if (arrList.length === list.length) {
                children.value.push(...arrList);
                res();
            }
        };
    }
});

const setInit = () => {
    const width = contain.value.getBoundingClientRect().width;
    widthArr.value = new Array(parseInt((width / elWidth.value))).fill(0);
    margin.value = parseInt((width % elWidth.value) / (widthArr.value.length - 1));
    console.log(imgList, children.value, 12, widthArr);
    calcArray(imgList);
};

const init = async () => {
    contain.value.innerHTML = '';
    children.value = [];
    idx.value = 0;
    preLoad(imgList).then(() => {
        setInit();
    });
    // setTimeout(async () => {
    //     idx.value = children.value.length;
    //     arrAllList.push(...imgList);
    //     await preLoad(imgList);
    //     calcArray(arrAllList);
    // }, 3000);
};

onMounted(async () => {
    preLoad(imgList).then(() => {
        setInit();
    });
    window.addEventListener('resize', init);
});
onUnmounted(() => {
    window.removeEventListener('resize', init);
});
</script>

<style scoped lang="less">
.contain {
    position: relative;
}
</style>
