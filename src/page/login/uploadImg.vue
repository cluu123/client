<template>
    <el-upload
        class="avatar-uploader formImg"
        :action="uploadFile"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :limit="1"
        accept=".png,.jpeg,.jpg"
    >
        <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import { uploadFile } from '@/lib/pubApi';
import { showFailToast } from 'vant';

export default {
    data() {
        return {
            uploadFile,
            imageUrl: '/img/default.jpeg'
        };
    },
    methods: {
        uploadSuccess(data) {
            if (data.code === 0) {
                this.imageUrl = data.data;
                this.$emit('upImg', data.data);
                return;
            }
            showFailToast(data.message);
        }
    }
};
</script>

<style scoped lang="less">
.formImg.avatar-uploader :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.formImg.avatar-uploader :deep(.el-upload:hover) {
    border-color: #409EFF;
}
.formImg :deep(.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}
.formImg :deep(.avatar) {
    width: 120px;
    height: 120px;
    display: block;
}
</style>
