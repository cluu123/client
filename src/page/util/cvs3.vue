<template>
    <div class="contain">
        <button @click="click">暂停</button>
        <canvas id="cvs"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: ['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'],
            canvas: null,
            ctx: null,
            resultData: [],
            timer: null,
            idx: 0
        };
    },
    mounted() {
        const { width, height } = document.querySelector('.contain').getBoundingClientRect();
        this.canvas = document.querySelector('#cvs');
        this.canvas.width = width;
        this.canvas.height = height - 46;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = '#f23422';
        this.ctx.font = '55px fangsong';

        this.init();
    },
    methods: {
        random(min, max, gap = 1) {
            return parseInt((Math.floor((Math.random() * (max - min + 1)) + min) * gap * gap) / gap);
        },
        init() {
            this.ctx.fillText(this.title[this.idx], (this.canvas.width - this.ctx.measureText(this.title[this.idx]).width) / 2, this.canvas.height / 2);
            const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.canvas.width; i += 3) {
                for (let j = 0; j < this.canvas.height; j += 3) {
                    const item = (this.canvas.width * j + i) * 4;
                    if (imgData.data[item] < 255 && imgData.data[item] >= 100) {
                        this.resultData.push({
                            startX: i,
                            startY: j,
                            endX: this.random(0, this.canvas.width),
                            endY: this.random(0, this.canvas.height),
                            speed: 0.1,
                            rgb: `(${this.random(30, 220)}, ${this.random(30, 220)}, ${this.random(30, 220)})`
                        });
                    }
                }
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
        },
        getLocation(startX, startY, endX, endY, t) {
            const control1X = 10;
            const control1Y = 20;
            const control2X = 10;
            const control2Y = 20;
            const x = Math.sqrt((1 - t), 3) * startX + 3 * Math.pow((1 - t), 2) * t * control1X + 3 * (1 - t) * Math.pow(t, 2) * control2X + Math.pow(t, 3) * endX;
            const y = Math.pow((1 - t), 3) * startY + 3 * Math.pow((1 - t), 2) * t * control1Y + 3 * (1 - t) * Math.pow(t, 2) * control2Y + Math.pow(t, 3) * endY;
            return { x, y };
        },
        draw() {
            this.timer = requestAnimationFrame(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let i = 0; i < this.resultData.length; i++) {
                    const {
                        startX, startY, endX, endY, speed
                    } = this.resultData[i];
                    const local = this.getLocation(startX, startY, endX, endY, speed);
                    this.resultData[i].speed += this.resultData[i].speed > 0.5 ? 0.01 : 0.05;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgb${this.resultData[i].rgb}`;
                    this.ctx.arc(local.x, local.y, 1, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                if (this.resultData[0].speed >= 1) {
                    cancelAnimationFrame(this.timer);
                    setTimeout(() => {
                        for (let i = 0; i < this.resultData.length; i++) {
                            this.resultData[i].speed = 0.1;
                        }
                        this.initDraw();
                    }, 500);
                    return;
                }
                if (this.resultData[0].speed >= 0.1 && this.resultData[0].speed < 0.16) {
                    setTimeout(() => {
                        this.draw();
                    }, 800);
                    return;
                }
                this.draw();
            });
        },
        initDraw() {
            this.timer = requestAnimationFrame(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let i = 0; i < this.resultData.length; i++) {
                    const {
                        startX, startY, endX, endY, speed
                    } = this.resultData[i];
                    const local = this.getLocation(endX, endY, startX, startY, speed);
                    this.resultData[i].speed += 0.01;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgb${this.resultData[i].rgb}`;
                    this.ctx.arc(local.x, local.y, 1, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                if (this.resultData[0].speed > 1) {
                    cancelAnimationFrame(this.timer);
                    this.againDrwa();
                    return;
                }
                this.initDraw();
            });
        },
        againDrwa() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.idx += 1;
            this.idx = this.idx > this.title.length - 1 ? 0 : this.idx;
            this.resultData = [];
            this.init();
            // for (let i = 0; i < this.resultData.length; i++) {
            //     const {
            //         startX, startY
            //     } = this.resultData[i];
            //     this.resultData[i].speed += 0.01;
            //     this.ctx.beginPath();
            //     this.ctx.strokeStyle = `rgb${this.resultData[i].rgb}`;
            //     this.ctx.arc(startX, startY, 1, 0, 2 * Math.PI);
            //     this.ctx.stroke();
            // }
        },
        click() {
            console.log(this.timer);
            cancelAnimationFrame(this.timer);
            if (this.timer) {
                this.timer = null;
                return;
            }
            this.init();
        }
    }
};
</script>

<style>
</style>
