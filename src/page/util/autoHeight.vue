<template>
    <div>
        <div @click="click">
            {{ obj }}
        </div>
        <el-button type="primary" @click="toggle1">toggle1</el-button>
        <div class="active1">
            <div class="item" v-for="(item, idx) in active" :key="idx">
                {{ item }}
            </div>
        </div>
        <el-button type="primary" @click="active2 = !active2">toggle2</el-button>
        <div :class="active2 ? 'active2 hei' : 'active2'">
            <div class="item" v-for="(item, idx) in active" :key="idx">
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            obj: {
                name: 11,
                arr: [
                    {
                        first: 0
                    }
                ]
            },
            active: [],
            height: [
                {
                    name: ''
                }
            ],
            active1: false,
            active2: false
        };
    },
    created() {
        console.log(22);
        const data = { age: 1122, arr: [{ first: 111 }, { two: 222 }] };
        Object.assign(this.obj, data);
        const arr = new Array(10).fill('');
        arr.forEach((ele, index) => {
            this.active.push(`afsdf ${index}`);
        });
    },
    methods: {
        toggle1() {
            const dom = document.querySelector('.active1');
            this.active1 = !this.active1;
            if (this.height === 0) {
                dom.style.height = 'auto';
                const height = dom.getBoundingClientRect().height;
                dom.style.height = 0;
                console.log(dom.offsetHeight);
                dom.style.height = `${height}px`;
                this.height = height;
                return;
            }
            if (this.active1) {
                dom.style.height = `${this.height}px`;
            }
            else {
                dom.style.height = 0;
            }
        },
        aadadaaaa(that) {
            console.log(this, that, this === that, 222);
        },
        changeEmit(val) {
            console.log('emit', val);
        },
        click() {
            const { arr } = this.obj;
            arr[0].cue = 111;
            console.log(this.obj);
        }
    }
};
</script>

<style lang="less" scoped>
.active1 {
    overflow: auto;
    border: 1px solid #e3e3ee;
    height: 0;
    transition: all 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.item {
    height: 50px;
    display: flex;
    align-items: center;
}
.active2 {
    border: 1px solid #e3e3ee;
    transform: scale(0);
    transform-origin: left top;
    transition: all 1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hei {
    transform: scale(1);
}
</style>
