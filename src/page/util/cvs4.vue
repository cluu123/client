<template>
    <div class="contain">
        <canvas id="cvs"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return {
            canvas: null,
            ctx: null,
            arr: []
        };
    },
    mounted() {
        const { width, height } = document.querySelector('.contain').getBoundingClientRect();
        this.canvas = document.querySelector('#cvs');
        this.canvas.width = width;
        this.canvas.height = height;
        const ctx = this.canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(20, 20, 10, 15, 15, 20);

        // 定义渐变的颜色和位置
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, 'blue');

        // 应用渐变到圆形
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(20, 20, 10, 0, 2 * Math.PI);
        ctx.fill();
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height, '#000');
        // this.init();
    },
    methods: {
        random(min, max, gap = 1) {
            return parseInt((Math.floor((Math.random() * (max - min + 1)) + min) * gap * gap) / gap);
        },
        init() {
            this.arr = new Array(100).fill().map(() => {
                const item = {
                    x: this.random(0, this.canvas.width),
                    y: this.random(0, this.canvas.height),
                    rgba: 'rgba(255, 255, 255, 1)'
                };
                return item;
            });
            for (let i = 0; i < this.arr.length; i += 1) {
                const item = this.arr[i];
                this.ctx.beginPath();
                const grd = this.ctx.createRadialGradient(item.x, item.y, 5, item.x + 4, item.y + 4, 10);
                grd.addColorStop(0, 'red');
                grd.addColorStop(1, 'white');
                this.ctx.fillStyle = item.rgba;
                this.ctx.arc(item.x, item.y, 1, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
};
</script>

<style>
</style>
