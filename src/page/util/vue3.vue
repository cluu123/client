<template>
    <div>
        111
    </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
export default {
    data() {
        return {
            a: 1
        };
    },
    mounted() {
        console.log(this.a, this.so, this.socket, getCurrentInstance().proxy.so);
    }
};
// console.log(getCurrentInstance().proxy);
</script>

<style>

</style>
