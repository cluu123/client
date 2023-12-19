<template>
    <div class="animat">
        <ul>
            <li draggable="true" class="d1">1</li>
            <li draggable="true" class="d2">2</li>
            <li draggable="true" class="d4">4</li>
            <li draggable="true" class="d3">3</li>
            <li draggable="true" class="d6">6</li>
            <li draggable="true" class="d5">5</li>
        </ul>
        <el-button @click="active">动起来</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            el: null,
            ul: null,
            arr: [],
            location: []
        };
    },
    mounted() {
        this.ul = document.querySelector('ul');
        this.el = document.querySelectorAll('li');

        let moveLoca = null;
        this.ul.addEventListener('dragstart', event => {
            event.dataTransfer.dragDelay = 20;
            event.dataTransfer.setData('text/plain', event.target.className);
            event.currentTarget.style.opacity = '0.5';

            moveLoca = event.clientY;
            for (let i = 0; i < this.el.length; i += 1) {
                this.el[i].startTop = this.el[i].getBoundingClientRect().top;
            }
        });
        this.ul.addEventListener('dragend', event => {
            // 拖拽结束时的相关操作
            event.currentTarget.style.opacity = '1';
        });

        this.ul.addEventListener('dragover', event => {
            // 阻止默认行为，允许元素放置到目标区域
            event.preventDefault();
        });
        this.ul.addEventListener('drop', event => {
            // 在目标区域释放元素时的相关操作
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            const draggedElement = document.querySelector(`.${data}`);

            let dropEle = event.target.nextSibling;
            if (event.clientY < moveLoca) {
                dropEle = event.target;
                console.log(dropEle);
            }
            this.ul.insertBefore(draggedElement, dropEle);
            for (let i = 0; i < this.el.length; i += 1) {
                this.el[i].endTop = this.el[i].getBoundingClientRect().top;
                this.move(this.el[i], this.el[i].startTop, this.el[i].endTop);
            }
        });
    },
    methods: {
        move(dom, start, end) {
            dom.animate([
                { transform: `translate(0, ${start - end}px)` },
                { transform: 'translate(0px, 0px)' }
            ], { duration: 200 });
        },
        getLocation() {
            this.location = [];
            for (let i = 0; i < this.el.length; i += 1) {
                this.el[i].y = this.el[i].getBoundingClientRect().top;
            }
            this.arr = [...this.el].map(ele => ({
                ele,
                top: ele.getBoundingClientRect().top
            }));
        },
        active() {
            this.getLocation();
            this.arr.sort(() => Math.random() - 0.5);
            for (let i = 0; i < this.arr.length; i += 1) {
                this.ul.insertBefore(this.arr[i].ele, this.el[i]);
            }
            for (let i = 0; i < this.arr.length; i += 1) {
                this.arr[i].end = this.arr[i].ele.getBoundingClientRect().top;
                this.move(this.arr[i].ele, this.arr[i].top, this.arr[i].end);
            }
        },
        delay() {
            const start = new Date();
            while (new Date() - start < 2000) {
                console.log(1);
            }
        }
    }
};
</script>

<style scoped lang="less">
.animat {
    height: 100vh;
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: #e3e3e3;
    position: relative;
}
.d1{
    background-color: #078a1a;
}
.d2 {
    background-color: aquamarine;
}
.d3 {
    background-color: rgb(127, 144, 255);
}
.d4 {
    background-color: rgb(255, 208, 127);
}
.d5 {
    background-color: rgb(232, 127, 255);
}
li {
    border-radius: 20px;
    height: 50px;
    line-height: 50px;
    padding: 5px;
    background-clip: content-box;
    text-align: center;
    background-color: #5c7203;
}
</style>
