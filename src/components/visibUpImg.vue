<template>
    <el-upload
        multiple
        class="avatar-uploader"
        accept=".jpg,.jepg,.png"
        :disabled="disabled"
        :action="uploadFile"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :limit="limit"
    >
        <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import { uploadFile } from '@/lib/pubApi';
import { showFailToast } from 'vant';

export default {
    props: {
        disabled: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            uploadFile,
            imageUrl: ''
        };
    },
    methods: {
        handleAvatarSuccess(data) {
            if (data.code === 0) {
                this.$emit('sendImg', data.data);
                return;
            }
            showFailToast(data.message);
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
