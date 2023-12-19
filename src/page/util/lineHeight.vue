<template>
    <div>
        <div v-for="(it, idx) in [1,2,3]" :key="idx">
            <span>{{ idx }}</span>
        </div>
        <el-select
            v-model="value"
            filterable
            @visible-change="initSelect"
            :filter-method="remoteMethod"
            placeholder="请选择"
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
            >
                <div v-if="item.label.length !== 1">
                    <span :style="item.label[0].show ? 'color: #f00' : ''"> {{ item.label[0].label }}</span>
                    <span :style="item.label[1].show ? 'color: #f00' : ''">{{ item.label[1].label }}</span>
                    <span :style="item.label[2].show ? 'color: #f00' : ''">{{ item.label[2].label }}</span>
                </div>
                <div v-else>
                    {{ item.label[0].label }}
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: [],
            list: []
        };
    },
    mounted() {
        this.list = [{
            value: '选项1',
            label: [
                {
                    label: '黄金糕金',
                    show: false
                }
            ]
        }, {
            value: '选项2',
            label: [
                {
                    label: '商品名称',
                    show: false
                }
            ]
        }, {
            value: '选项3',
            label: [
                {
                    label: ' husked',
                    show: false
                }
            ]
        }, {
            value: '选项4',
            label: [
                {
                    label: '测试阿卡',
                    show: false
                }
            ]
        }, {
            value: '选项5',
            label: [
                {
                    label: '啊啥的空间',
                    show: false
                }
            ]
        }];
        this.options = [...this.list];
    },
    methods: {
        remoteMethod(query) {
            if (query !== '') {
                setTimeout(() => {
                    const filter = [];
                    const regexp = new RegExp(`(${query})`, 'g');
                    this.list.forEach(ele => {
                        const item = ele.label[0].label;
                        const temp = [];
                        if (item.includes(query)) {
                            const data = item.replace(regexp, ',$1#,').split(',');
                            if (data.length) {
                                data.forEach(el => {
                                    if (!el.includes('#')) {
                                        temp.push({ label: el, show: false });
                                        return;
                                    }
                                    temp.push({ label: el.replace(/#/g, ''), show: true });
                                });
                            }
                            filter.push({
                                value: ele.value,
                                label: temp
                            });
                        }
                    });
                    this.options = filter;
                }, 200);
            }
            else {
                console.log(22);
                this.options = [];
            }
        },
        initSelect(bool) {
            if (bool) {
                this.options = [...this.list];
            }
        }
    }
};
</script>

<style>

</style>
