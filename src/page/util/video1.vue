<template>
</template>

<script>
import { getTxt, getCache } from '@/lib/test';

export default {
    mounted() {
        const blob = new Blob(['name'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        console.log(url);
        getTxt().then(res => {
            console.log(res);
        });
        getCache().then(res => {
            console.log(res);
        });
    }
};
</script>

<style>
</style>
