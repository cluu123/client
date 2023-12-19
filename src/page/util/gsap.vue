<template>
    <div class="gsap">
        <div class="d1">✈️</div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default {
    data() {
        return {};
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger);
        const t1 = gsap.timeline({
            scrollTrigger: {
                trigger: '.gsap',
                start: 'top top',
                end: 'bottom bottom',
                markers: true,
                scrub: true
            }
        });
        t1.to('.d1', {
            y: 600,
            x: 200,
            rotateX: 360
        }).to('.d1', {
            x: 300
        })
            .to('.d1', {
                y: 200,
                rotateY: 180
            })
            .to('.d1', {
                x: 600,
                y: 400
            })
            .to('.d1', {
                rotateZ: 90
            })
            .to('.d1', {
                x: 0
            });
        t1.to('.gsap', { backgroundImage: 'linear-gradient(to bottom,rgba(99, 167, 191, 1),rgba(94, 86, 179, 1),rgba(72, 139, 163, 1),rgba(79, 124, 179, 1),rgba(52, 115, 140, 1),rgba(48, 92, 145, 1),rgba(39, 82, 145, 1),rgba(19, 58, 110, 1),rgba(10, 50, 80, 1),rgba(40, 41, 100, 1),rgba(14, 52, 94, 1)' }, '>-3');
    }
};
</script>

<style lang="less" scoped>
.gsap {
    width: 100%;
    height: 4000px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background: #e3e3e3;
    .d1 {
        font-size: 80px;
        width: 80px;
        height: 80px;
    }
}
</style>
