<template>
    <div class="audioVisib">
        <canvas id="canvas"></canvas>
        <audio :src="url" @loadedmetadata="calcDuration"></audio>
        <div class="player">
            <div class="player-play">
                <img
                    v-if="status === 'pause'"
                    src="@/assets/pause.svg"
                    alt=""
                    class="btn"
                    @click="changeAudio('play')"
                />
                <img
                    v-else
                    src="@/assets/play.svg"
                    alt=""
                    class="btn"
                    @click="changeAudio('pause')"
                />
            </div>
            <div class="player-duration">
                <span>{{ audioObj.currentTime }}</span>
                <span class="player-duration-center">/</span>
                <span>{{ audioObj.duration }}</span>
            </div>
            <div class="player-timer">
                <span class="process" ref="processEle" @click="toProcess"></span>
                <span
                    ref="pointEle"
                    class="point"
                    @mousedown="moveStart"
                    @mouseup="moveEnd"
                    @touchstart="moveStart"
                    @touchend="moveEnd"
                ></span>
            </div>
            <div class="player-audio">
                <img src="@/assets/aPlay.svg" alt=""/>
            </div>
        </div>
        {{setAudio}}
        <img src="@/assets/audio.jpg" alt="" :style="setAudioImgStyle()" :class="audioImg.setAudio ? 'audioImg active' : 'audioImg'"/>
    </div>
</template>

<script>

export default {
    data() {
        return {
            url: require('@/assets/dynamic.mp3'),
            audioObj: {
                el: null,
                ctx: null,
                analyser: null,
                arr: null,
                duration: 0,
                currentTime: '00:00',
                processWidth: 0,
                pointWidth: 0
            },
            ctx: null,
            status: 'pause',
            audioAnimat: null,
            lightAnimat: null,
            audioImg: {
                setAudio: false,
                once: true
            }
        };
    },
    methods: {
        init() {
            const main = document.querySelector('.audioVisib');
            const canvas = document.querySelector('canvas');
            canvas.width = main.getBoundingClientRect().width > 350 ? 350 : main.getBoundingClientRect().width;
            canvas.height = 300;
            this.ctx = canvas.getContext('2d');
            this.ctx.width = canvas.width;
            this.ctx.height = canvas.height;
            const audioNode = document.querySelector('audio');
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const audioSource = audioCtx.createMediaElementSource(audioNode);

            const audioAns = audioCtx.createAnalyser();
            audioAns.fftSize = 256;

            audioSource.connect(audioAns);
            audioSource.connect(audioCtx.destination);

            const audioLength = new Uint8Array(audioAns.frequencyBinCount);
            audioAns.getByteFrequencyData(audioLength);

            this.audioObj.el = audioNode;
            this.audioObj.analyser = audioAns;
            this.audioObj.arr = audioLength;
            this.audioObj.ctx = audioCtx;
            this.audioObj.processWidth = this.$refs.processEle.getBoundingClientRect().width;
            this.audioObj.startLeft = this.$refs.processEle.getBoundingClientRect().left;
            this.audioObj.pointWidth = this.$refs.pointEle.getBoundingClientRect().width;
        },
        draw() {
            this.audioAnimat = requestAnimationFrame(() => {
                const audioLength = new Uint8Array(this.audioObj.analyser.frequencyBinCount);
                this.audioObj.analyser.getByteFrequencyData(audioLength);
                this.mouseEvent(null, true);
                this.calcDuration();
                // this.drawCanvas1(audioLength, this.ctx);

                this.drawCanvas(audioLength, this.ctx);

                if (this.audioObj.el.currentTime === this.audioObj.el.duration) {
                    this.changeAudio('pause');
                }
                else {
                    this.draw();
                }
            });
        },
        drawLight() {
            const lintCanvas = document.createElement('canvas');
            const lintCtx = lintCanvas.getContext('2d');
            lintCanvas.setAttribute('style', 'position: absolute; top: 0; left: 50%; transform: translateX(-50%)');
            lintCanvas.width = this.ctx.width;
            lintCanvas.height = this.ctx.height;
            const lightArr = new Array(30).fill(0).map(() => ({
                left: Math.random() * lintCanvas.width,
                top: Math.random() * lintCanvas.height,
                width: Math.random() * 15,
                local: Math.random(),
                color: Math.random()
            }));
            const setLight = () => {
                lintCtx.clearRect(0, 0, lintCanvas.width, lintCanvas.height);
                for (let i = 0; i < lightArr.length; i += 1) {
                    lintCtx.beginPath();
                    lightArr[i].color -= 0.001;
                    lightArr[i].top += 0.3;
                    if (lightArr[i].local > 1) {
                        if (lightArr[i].local > 1.7) {
                            lightArr[i].local = Math.random();
                        }
                        lightArr[i].left -= 0.1;
                    }
                    else {
                        lightArr[i].left += 0.3;
                    }
                    lightArr[i].local += 0.01;
                    const {
                        left, top, width, color
                    } = lightArr[i];
                    if (color <= 0 || left < 0 || left > lintCanvas.width || top > lintCanvas.height) {
                        const item = {
                            left: Math.random() * lintCanvas.width,
                            top: 0,
                            width: Math.random() * 16,
                            local: Math.random(),
                            color: Math.random()
                        };
                        lightArr.splice(i, 1, item);
                        i -= 1;
                    }
                    // lintCtx.fillStyle = `rgba(255, 255, 255, ${color})`;
                    // lintCtx.fillRect(left, top, width, width);

                    lintCtx.font = `${width}px Arial`;
                    lintCtx.fillStyle = `rgba(255, 255, 255, ${color})`;
                    lintCtx.fillText('❄', left, top);

                    // lintCtx.arc(left, top, width, 0, Math.PI * 2);
                    // lintCtx.fill();
                    lintCtx.closePath();
                }
                this.lightAnimat = requestAnimationFrame(setLight);
            };
            this.lightAnimat = requestAnimationFrame(setLight);
            document.querySelector('.audioVisib').appendChild(lintCanvas);
        },
        drawCanvas1(data, ctx) {
            ctx.clearRect(0, 0, ctx.width, ctx.height);
            ctx.fillStyle = '#424242';
            const total = 60;
            const gap = Math.floor(data.length / total);
            for (let i = 0; i < data.length; i += gap) {
                const left = ctx.width / total * i;
                const grd = ctx.createLinearGradient(left, ctx.height, left, -data[i]);
                grd.addColorStop(0, '#424242');
                grd.addColorStop(0.3, '#46b3c6');
                grd.addColorStop(0.6, '#749d0c');
                grd.addColorStop(1, '#780084');
                ctx.fillStyle = grd;
                ctx.fillRect(left, ctx.height, 5, -data[i]);
            }
        },
        drawCanvas(data, ctx) {
            if (!this.audioImg.setAudio) {
                this.audioImg.setAudio = true;
            }
            ctx.clearRect(0, 0, ctx.width, ctx.height);

            ctx.arc(ctx.width / 2, ctx.height / 2, ctx.height / 5, 0, Math.PI * 2);
            ctx.fillStyle = '#424242';
            ctx.fill();

            const total = 60;
            const gap = Math.floor(data.length / total);
            const gapRate = 360 / data.length;
            for (let i = 0; i < data.length; i += gap) {
                let height = ctx.height / 5 + data[i] / 10;
                const gradRate = ctx.height / 5 / height;
                if (gapRate > 90 && gapRate < 270) {
                    height = -height;
                }
                const gradHeight = ctx.height / 2 + height;
                const grd = ctx.createLinearGradient(ctx.width / 2, ctx.height / 2, ctx.width / 2, gradHeight);
                grd.addColorStop(0, '#424242');
                grd.addColorStop(gradRate, '#424242');
                grd.addColorStop(gradRate, 'red');
                grd.addColorStop(1, 'red');
                ctx.fillStyle = grd;
                ctx.translate(ctx.width / 2, ctx.height / 2);
                ctx.rotate(i * gapRate * Math.PI / 180);
                ctx.translate(-ctx.width / 2, -ctx.height / 2);
                ctx.fillRect(ctx.width / 2, ctx.height / 2, 5, height);
            }
        },
        changeAudio(status) {
            this.audioImg.once = false;
            this.status = status;
            cancelAnimationFrame(this.audioAnimat);
            if (status === 'play') {
                this.audioObj.ctx.resume().then(() => {
                    this.audioObj.el.play();
                    this.drawLight();
                    this.draw();
                    this.audioImg.setAudio = true;
                });
            }
            else {
                this.audioObj.el.pause();
                this.audioImg.setAudio = false;
            }
        },
        toProcess(e) {
            this.mouseEvent(e);
            this.changeAudio('play');
        },
        moveStart(e) {
            e.target.classList.add('active');
            this.addEvent();
        },
        moveEnd(e) {
            e.target.classList.remove('active');
            this.removeEvent();
            this.$nextTick(() => {
                this.changeAudio('play');
            });
        },
        addEvent() {
            document.addEventListener('touchmove', this.mouseEvent);
            document.addEventListener('mousemove', this.mouseEvent);

            document.addEventListener('mouseup', this.removeEvent);
            document.addEventListener('touchend', this.removeEvent);
        },
        removeEvent() {
            document.removeEventListener('touchmove', this.mouseEvent);
            document.removeEventListener('mousemove', this.mouseEvent);

            document.removeEventListener('mouseup', this.removeEvent);
            document.removeEventListener('touchend', this.removeEvent);
        },
        mouseEvent(e, bool) {
            const { startLeft, processWidth, pointWidth } = this.audioObj;
            const { currentTime, duration } = this.audioObj.el;
            if (bool) {
                const distance = currentTime / duration * (processWidth - pointWidth);
                this.$refs.processEle.style.background = `linear-gradient(to right, #7dffde 0%, #c325fa ${distance}px, #d3d3d3 ${distance}px, #d3d3d3 100%)`;
                this.$refs.pointEle.style.left = `${distance}px`;
            }
            else {
                let { clientX } = e.touches ? e.touches[0] : e;

                clientX = clientX <= startLeft ? startLeft : clientX;
                clientX = clientX >= (startLeft + processWidth) ? (startLeft + processWidth) : clientX;

                const currentLocal = clientX - startLeft;
                this.audioObj.el.currentTime = Math.floor((currentLocal / processWidth) * duration);
                this.$refs.processEle.style.background = `linear-gradient(to right, #7dffde 0%, #c325fa ${currentLocal / processWidth * 100}%, #d3d3d3 ${currentLocal / processWidth * 100}%, #d3d3d3 100%)`;
                this.$refs.pointEle.style.left = `${currentLocal - pointWidth / 2}px`;
            }
        },
        calcDuration() {
            const { duration } = this.audioObj.el;
            const min = Math.floor(duration / 60);
            const sec = Math.floor(duration % 60);
            this.audioObj.duration = `${min}:${sec < 10 ? `0${sec}` : sec}`;
            if (this.audioObj.el.currentTime < 10) {
                this.audioObj.currentTime = `00:0${Math.floor(this.audioObj.el.currentTime)}`;
            }
            else if (this.audioObj.el.currentTime > 10 && this.audioObj.el.currentTime < 60) {
                this.audioObj.currentTime = `00:${Math.floor(this.audioObj.el.currentTime)}`;
            }
            else if (this.audioObj.el.currentTime > 60 && this.audioObj.el.currentTime < 600) {
                if (Math.floor(this.audioObj.el.currentTime % 60) < 10) {
                    this.audioObj.currentTime = `0${Math.floor(this.audioObj.el.currentTime / 60)}:0${Math.floor(this.audioObj.el.currentTime % 60)}`;
                }
                else {
                    this.audioObj.currentTime = `0${Math.floor(this.audioObj.el.currentTime / 60)}:${Math.floor(this.audioObj.el.currentTime % 60)}`;
                }
            }
        },
        play() {
            this.audioObj.el.play();
            this.audioImg.setAudio = true;
        },
        pause() {
            this.audioObj.el.pause();
            this.audioImg.setAudio = false;
        },
        setAudioImgStyle() {
            if (this.audioImg.setAudio && this.ctx) {
                return {
                    display: 'block',
                    width: `${this.ctx.height / 2.5}px`,
                    height: `${this.ctx.height / 2.5}px`,
                    left: '50%',
                    top: `${90}px`,
                    position: 'absolute',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)'
                };
            }
            if (!this.audioImg.once && !this.audioImg.setAudio) {
                return {
                    display: 'block',
                    width: `${this.ctx.height / 2.5}px`,
                    height: `${this.ctx.height / 2.5}px`,
                    left: '50%',
                    top: `${90}px`,
                    position: 'absolute',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)'
                };
            }

            if (this.audioImg.once && !this.audioImg.setAudio) {
                return 'display: none';
            }
            return '';
        }
    },
    mounted() {
        document.querySelector('.audioVisib').addEventListener('contextmenu', event => {
            event.preventDefault();
        });
        this.init();
    }
};
</script>

<style scoped lang="less">
.audioVisib {
    width: 100%;
    height: 100vh;
    text-align: center;
    background-color: #000;
    #canvas {
        width: 100%;
        max-width: 350px;
        height: 300px;
    }
    .player {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 100%;
        max-width: 500px;
        height: 50px;
        background-color: #fff;
        border-radius: 25px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        &-play {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-right: 10px;
            .btn {
                color: #000;
                width: 20px;
                height: 20px;
            }
        }
        &-duration {
            width: 90px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            &-center {
                padding: 0 3px;
            }
        }
        &-timer {
            cursor: pointer;
            flex: 1;
            display: flex;
            position: relative;
            .process {
                width: 100%;
                height: 4px;
                border-radius: 2px;
                background-color: #d3d3d3;
                display: flex;
                align-items: center;
            }
            .point {
                width: 10px;
                height: 10px;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 50%;
                background-color: #000;
                position: absolute;
                cursor: pointer;
            }
            .active {
                transform: translateY(-50%) scale(1.5);
            }
        }
        &-audio {
            width: 20px;
            height: 20px;
            margin-left: 10px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
.audioImg {
    animation: audioImg 15s linear infinite running;
    animation-play-state: paused;
}
.audioImg.active {
    animation: audioImg 15s linear infinite running;
    animation-play-state: running;
}
@keyframes audioImg {
    from {
        transform: translateX(-50%) rotate(0deg);
    }
    to {
        transform: translateX(-50%) rotate(360deg);
    }
}
</style>
