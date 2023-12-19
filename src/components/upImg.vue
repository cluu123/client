<template>
    <el-upload
        multiple
        class="avatar-uploader"
        accept=".jpg,.jepg,.png,.webp,.mp4,.avi,.mov,.wmv,.flv,.mkv"
        :action="uploadFile"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeUpload"
        :limit="5"
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
            imageUrl: '',
            type: 1
        };
    },
    methods: {
        handleAvatarSuccess(data) {
            if (data.code === 0) {
                this.$emit('sendInfo', {
                    data: data.data,
                    type: this.type
                });
                this.type = 1;
                return;
            }
            showFailToast(data.message);
        },
        beforeUpload(file) {
            const typeArr = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
            if (typeArr.includes(file.type.split('/')[1])) {
                this.type = 2;
            }
            return true;
        }
    }
};
</script>

<style lang="less" scoped>
.avatar-uploader {
    height: 0;
    overflow: hidden;
    .el-upload {
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
