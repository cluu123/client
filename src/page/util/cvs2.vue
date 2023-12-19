<template>
    <div class="main">
        <el-button type="primary" @click="change">change</el-button>
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return {
            number: null,
            sizeX: 20,
            sizeY: [],
            ctx: null,
            draw: null,
            text: 'ab✦c★◑◐♠e✣g☃ijk❈➹mn❤pq❦l❥tuvw☂z',
            canvas: null
        };
    },
    mounted() {
        this.canvas = document.querySelector('#canvas');
        this.ctx = this.canvas.getContext('2d');
        this.countSize();
        window.addEventListener('resize', this.countSize);
    },
    beforeUnmount() {
        cancelAnimationFrame(this.draw);
        window.removeEventListener('resize', this.countSize);
    },
    methods: {
        countSize() {
            cancelAnimationFrame(this.draw);
            const { width, height } = document.querySelector('.main').getBoundingClientRect();
            this.canvas.width = width;
            this.canvas.height = height;
            this.sizeY = [];
            this.number = parseInt(width / this.sizeX);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.initCanvas();
        },
        initCanvas() {
            const arr = new Array(this.number).fill().map((ele, index) => (index + 1) * this.sizeX);
            let timeGap = 0;
            const draw = time => {
                if (time - timeGap < 30) {
                    this.draw = requestAnimationFrame(draw);
                    return;
                }
                timeGap = time;
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                for (let i = 0; i < arr.length; i++) {
                    this.sizeY.splice(i, 1, (this.sizeY[i] || 0) + this.sizeX);
                    this.ctx.fillStyle = `rgb(${this.randomNum(0, 255)}, ${this.randomNum(0, 255)}, ${this.randomNum(0, 255)})`;
                    this.ctx.font = `${this.sizeX}px fangsong`;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(this.text[this.randomNum(0, this.text.length - 1)], arr[i], this.sizeY[i]);
                    if (Math.random() > 0.9 && this.sizeY[i] >= this.canvas.height) {
                        this.sizeY[i] = this.sizeX;
                    }
                }
                this.draw = requestAnimationFrame(draw);
            };
            this.draw = requestAnimationFrame(draw);
        },
        randomNum(n, m) {
            return Math.floor(Math.random() * (m - n + 1) + n);
        },
        change() {
            if (this.draw) {
                cancelAnimationFrame(this.draw);
                this.draw = null;
                return;
            }
            this.initCanvas();
        }
    }
};
</script>

<style lang="less" scoped>
.main {
    text-align: center;
}
</style>
