<template>
    <div class="main">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ctx: null,
            width: null,
            height: null
        };
    },
    mounted() {
        this.initCanvas();
    },
    methods: {
        reqAni(start, boundary) {
            const begin = start;
            const fun = () => {
                if (start > boundary) {
                    cancelAnimationFrame(this.reqAni);
                    return;
                }
                start += 0.01;
                this.ctx.beginPath();
                this.ctx.lineWidth = '20';
                this.ctx.arc(this.width / 2, this.height / 2, 100, Math.PI * begin, Math.PI * start, false);
                this.ctx.stroke();
                requestAnimationFrame(fun);
            };
            requestAnimationFrame(fun);
        },
        initCanvas() {
            const main = document.querySelector('.main').getBoundingClientRect();
            const canvas = document.querySelector('#canvas');
            console.log(main, document.querySelector('.main').offsetHeight);
            this.width = main.width;
            this.height = main.height;
            canvas.width = this.width;
            canvas.height = this.height - 46;
            this.ctx = canvas.getContext('2d');
            this.ctx.fillStyle = '#e3e3e3';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.strokeStyle = '#f00';
            this.reqAni(1, 4);
        }
    }
};
</script>

<style lang="less" scoped>
.main {
    text-align: center;
}
</style>
