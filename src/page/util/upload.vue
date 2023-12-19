<template>
    <div>
        <el-upload
            action=""
            :on-change="change"
            :auto-upload="false"
            :limit="3"
            :file-list="fileList"
        >
            <el-button size="small" type="primary"> 点击上传 </el-button>
            <template #tip>
                <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
        </el-upload>
        <div v-for="item of Object.entries(uploadPrecent)" :key="item[0]">
            <div>
                <span>{{ item[0] }}</span>
                <el-progress
                    :percentage="item[1]"
                    :format="format"
                    :status="item[1] === 100 ? 'success' : ''"
                />
            </div>
        </div>
        <el-button type="primary" @click="ready" :loading="loading"> upload </el-button>
        <el-button type="primary" @click="upload" :loading="loading"> upload </el-button>
    </div>
</template>

<script>
import { testFile1, upRes } from '@/lib/test';
import SparkMd5 from 'spark-md5';

export default {
    data() {
        return {
            form: null,
            type: null,
            loading: false,
            params: [],
            fileArr: [],
            fileList: [],
            uploadPrecent: {},
            customColors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 }
            ]
        };
    },
    methods: {
        setMd5Nmae(data) {
            return new Promise(res => {
                const file = new FileReader();
                file.onload = e => {
                    const buffer = e.target.result;
                    const md5 = new SparkMd5.ArrayBuffer();
                    md5.append(buffer);
                    const hash = md5.end();
                    res(hash);
                };
                file.readAsArrayBuffer(data);
            });
        },
        change(file) {
            this.params = [];
            this.fileArr = [];
            this.fileList = [file];
            this.type = file.raw.type.replace(/.*\//, '.');
            const breakLength = 3;
            const breakSize = file.size / breakLength;
            this.loading = true;
            for (let i = 0; i < breakLength; i++) {
                if (i === breakLength - 1) {
                    this.params.push({
                        file: file.raw.slice(i * breakSize)
                    });
                }
                else {
                    this.params.push({
                        file: file.raw.slice(i * breakSize, (i + 1) * breakSize)
                    });
                }
            }
            this.loading = false;
            console.log(this.params, file);
        },
        async ready() {
            // const work = new Worker('/hashWork.js', {
            //     type: 'module'
            // })
            // work.postMessage(params)
            // work.onmessage = e => {
            //     console.log(e);
            // }
            // work.onerror = e => {
            //     console.log(e);
            // }
            // work.terminate();
            this.loading = true;
            for (const ele of this.params) {
                const form = new FormData();
                // eslint-disable-next-line
                const hash = await this.setMd5Nmae(ele.file);
                form.append('f1', ele.file, hash);
                this.fileArr.push(hash);
                testFile1(form, e => this.onProcess(e, hash));
            }
            this.loading = false;
        },
        upload() {
            this.loading = true;
            upRes({
                type: this.type,
                fileArr: this.fileArr
            })
                .then(res => {
                    console.log(res);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onProcess(e, hash) {
            const { loaded, total } = e;
            const uploadPrecent = (loaded / total) * 100 || 0;
            if (hash in this.uploadPrecent) {
                this.uploadPrecent[hash] = uploadPrecent;
            }
            else {
                this.uploadPrecent[hash] = uploadPrecent;
                // this.$set(this.uploadPrecent, hash, uploadPrecent);
            }
        },
        format(percentage) {
            return percentage === 100 ? '' : `${percentage}%`;
        }
    }
};
</script>

<style lang="less" scoped>
:depe(.el-icon-circle-check) {
    color: #71c548 !important;
}
</style>
