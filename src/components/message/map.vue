<template>
    <div :id="props.index" class="contain">
    </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, defineProps } from 'vue';

const props = defineProps({
    index: String
});

onMounted(() => {
    AMapLoader.load({
        key: '8da8e21e513f2a965ca13dbcae24c398', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0' // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    }).then(AMap => {
        const mapObj = new AMap.Map(props.index, {
            resizeEnable: true
        });
        mapObj.plugin('AMap.Geolocation', () => {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                timeout: 10000, // 超过10秒后停止定位，默认：无穷大
                maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true, // 显示定位按钮，默认：true
                buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition((status, result) => {
                console.log(result, status, 232);
                if (status === 'complete') {
                    console.log(result);
                    alert(result.position);
                }
            });
        });
        // map.plugin('AMap.CitySearch', () => {
        //     const citySearch = new AMap.CitySearch();
        //     citySearch.getLocalCity((status, result) => {
        //         if (status === 'complete' && result.info === 'OK') {
        //             // 查询成功，result即为当前所在城市信息
        //             console.log(result);
        //         }
        //     });
        // });
    }).catch(e => {
        console.log(e);
    });
});
</script>

<style lang="less" scoped>
.contain {
    width: 250px;
    height: 200px;
}
</style>
