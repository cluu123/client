<template>
    <div class="mainMess" v-loading="loading">
        <Back :title="title">
            <template #right>
                <van-icon name="ellipsis" @click="toFriendInfo"/>
            </template>
        </Back>
        <MessMain
            ref="messMainEl"
            :messMainInfo="messMainInfo"
            @visibBtnHeight="visibBtnHeight"
        />
        <MessInput
            ref="messInputEl"
            :user="user"
            :messMainInfo="messMainInfo"
            @sendInfo="sendInfo"
            @initVideo="initVideo"
            @mainScrollBottom="mainScrollBottom"
        />
        <van-overlay :show="showVideo" :lazy-render="false" @click="show = false" class="mask">
            <img src="@/assets/fan.svg" alt="" class="turnPhoto" @click="turn"/>
            <img src="@/assets/3.jpg" alt="" v-if="videoReqStatus" class="img"/>
            <video
                autoplay
                id="video1"
                v-else
                :class="videoClass ? 'video1' : 'video2'"
                @click="videoClass = !videoClass"
            ></video>
            <video
                autoplay
                id="video2"
                :class="!videoClass ? 'video1' : 'video2'"
                @click="videoClass = !videoClass"
            ></video>
            <div class="wrapper" @click.stop v-if="videoReqStatus">
                <van-button v-if="userVideo" type="danger" @click="dropped(1)">取消</van-button>
                <div v-else>
                    <van-button class="wrapper-btn" type="danger" @click="dropped(2)">拒绝</van-button>
                    <van-button type="success" @click="submit">同意</van-button>
                </div>
            </div>
            <div class="wrapper" v-else>
                <van-button type="danger" @click="dropped(3)">挂断</van-button>
            </div>
        </van-overlay>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import Back from '@/components/goBack';
import MessMain from '@/components/message/messMain';
import MessInput from '@/components/message/messInput';
import { getOtoMessage, setMessageStatus } from '@/lib/mess';
import { useCounterStore } from '@/vuex';
import { showFailToast } from 'vant';

export default {
    components: {
        MessMain,
        MessInput,
        Back
    },
    data() {
        return {
            num: 1,
            loading: false,
            user: useCounterStore().user,
            messMainInfo: {
                messInfo: [],
                imgList: []
            },
            img: this.$route.query.img,
            fid: this.$route.query.fid,
            title: this.$route.query.fid,
            showVideo: false,
            rtcConfig: {
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302'
                    },
                    {
                        urls: 'turn:106.14.213.55:3478',
                        username: 'test',
                        credential: 'jsugu&dh2'
                    },
                    {
                        urls: 'turn:120.26.107.137:3478',
                        username: 'uu',
                        credential: '123456'
                    }
                ]
            },
            messageMap: {
                1: '取消通话',
                2: '拒绝通话',
                3: '挂断通话'
            },
            localRtc: null,
            remoteRtc: null,
            localStream: null,
            remoteStream: null,
            videoClass: true,
            videoReqStatus: true,
            userVideo: false,
            telToId: null
        };
    },
    mounted() {
        this.socket.emit('back message');
        this.socket.on('back message ready', () => {
            this.loading = true;
            getOtoMessage({ uid: this.user.tot_uid, fid: this.fid }).then(res => {
                res.forEach(ele => {
                    ele.img = ele.uid === this.user.tot_uid ? this.user.img : this.img;
                });
                this.messMainInfo.imgList = res.filter(ele => ele.type === 1);
                this.messMainInfo.messInfo = res.sort((a, b) => a.time - b.time);
                this.loading = false;
            }).finally(() => {
                this.mainScrollBottom();
                this.initSocket();
            });
            setMessageStatus({ fid: this.fid });
        });
        document.addEventListener('contextmenu', this.listenContextMenu);
    },
    beforeUnmount() {
        this.remoteStream && this.remoteStream.getTracks().forEach(track => {
            track.stop();
        });
        this.localStream && this.localStream.getTracks().forEach(track => {
            track.stop();
        });
        this.socket.emit('close track', {
            uid: this.user.uid,
            fid: this.fid
        });
        console.log(this.localStream, this.remoteStream);
        // this.socket.emit('back message');
        document.removeEventListener('contextmenu', this.listenContextMenu);
        this.clearStream();
    },
    methods: {
        listenContextMenu(e) {
            e.preventDefault();
        },
        initSocket() {
            // 交换socketId
            this.socket.emit('one exchange socket id', {
                uid: this.user.tot_uid,
                fid: this.fid
            });
            this.socket.on('o-o message', data => {
                console.log(this.remoteStream, this.localRtc);
                // 消息撤回
                if (data.type === -1) {
                    this.messMainInfo.messInfo.find(ele => {
                        if (ele.time === data.time && ele.uid === data.uid && ele.fid === data.fid) {
                            ele.type = -1;
                            return true;
                        }
                        return false;
                    });
                }
                else if (((data.uid === this.user.tot_uid) || (data.fid === this.user.tot_uid))) {
                    if (data.type === 5) {
                        const mess = this.messMainInfo.messInfo;
                        if ((data.time - mess[mess.length - 1].time) > 1000) {
                            this.messMainInfo.messInfo.push({
                                ...data,
                                img: data.uid === this.user.tot_uid ? this.user.img : this.img
                            });
                        }
                    }
                    else {
                        this.messMainInfo.messInfo.push({
                            ...data,
                            img: data.uid === this.user.tot_uid ? this.user.img : this.img
                        });
                    }
                }
                this.mainScrollBottom();
            });

            this.socket.on('offer', async data => {
                if (data.uid === this.fid && data.fid === this.user.uid && data.offer && this.remoteRtc) {
                    this.videoReqStatus = false;
                    this.telToId = data.uid;
                    await this.remoteRtc.setRemoteDescription(JSON.parse(data.offer)).catch(err => {
                        console.log(err, 1);
                    });
                    this.remoteRtc.createAnswer().then(answer => {
                        this.remoteRtc.setLocalDescription(answer).then(() => {
                            this.socket.emit('answer', {
                                uid: this.user.uid,
                                fid: this.fid,
                                answer: JSON.stringify(answer)
                            });
                        }).catch(err => {
                            console.log(err, 4);
                        });
                    }).catch(err => {
                        console.log(err, 3);
                    });
                }
            });

            this.socket.on('answer', data => {
                if (data.uid === this.fid && (data.fid === this.user.uid) && data.answer && this.localRtc) {
                    this.videoReqStatus = false;
                    this.localRtc.setRemoteDescription(JSON.parse(data.answer)).catch(err => {
                        console.log(err, 5);
                    });
                }
            });

            this.socket.on('remote ice', data => {
                if (data.uid === this.fid && data.fid === this.user.uid && data.ice && this.remoteRtc) {
                    this.remoteRtc && this.remoteRtc.addIceCandidate(JSON.parse(data.ice)).catch(err => {
                        console.log(err, 6);
                    });
                }
            });

            this.socket.on('local ice', data => {
                if (data.uid === this.fid && data.fid === this.user.uid && data.ice) {
                    this.localRtc && this.localRtc.addIceCandidate(JSON.parse(data.ice)).catch(err => {
                        console.log(err, 7);
                    });
                }
            });

            this.socket.on('agree', async data => {
                if (data.uid === this.fid && data.fid === this.user.uid && this.localRtc) {
                    // 正在通话
                    this.telToId = data.uid;
                    console.log(this.localRtc, 222);
                    const offer = await this.localRtc.createOffer().catch(err => {
                        console.log(err, 8);
                    });
                    await this.localRtc.setLocalDescription(offer).catch(err => {
                        console.log(err, 9);
                    });
                    this.socket.emit('offer', {
                        uid: this.user.uid,
                        fid: this.fid,
                        offer: JSON.stringify(offer)
                    });
                }
            });

            this.socket.on('dropped', data => {
                if (data.uid === this.fid && data.fid === this.user.uid) {
                    this.showVideo = false;
                    this.localStream && this.localStream.getTracks().forEach(track => {
                        track.stop();
                    });
                    this.remoteStream && this.remoteStream.getTracks().forEach(track => {
                        track.stop();
                    });
                    this.remoteStream = null;
                    this.localStream = null;
                    this.telToId = null;
                    setTimeout(() => {
                        this.userVideo = false;
                        this.videoReqStatus = true;
                    }, 1000);
                }
                this.socket.emit('o-o message', {
                    time: dayjs().valueOf(),
                    type: 5,
                    uid: data.uid,
                    fid: data.fid,
                    message: this.messageMap[data.type],
                    status: 0
                });
            });

            this.socket.on('askAgree', data => {
                if (data.uid === this.fid && data.fid === this.user.uid) {
                    if (this.telToId) {
                        this.socket.emit('busy', {
                            uid: this.user.uid,
                            fid: this.fid
                        });
                        showFailToast(`${data.uid}请求连线`);
                        return;
                    }
                    this.showVideo = true;
                    this.userVideo = false;
                }
            });

            // 对方正在占线
            this.socket.on('busy', data => {
                if (data.uid === this.fid && data.fid === this.user.uid) {
                    this.clearStream();
                    showFailToast('对方正在通话中...');
                }
            });

            // 对方正在输入
            this.socket.on('user input', data => {
                if (data.uid === this.fid && data.fid === this.user.uid) {
                    this.title = '正在输入中...';
                }
            });

            // 对方正在输入
            this.socket.on('user blur', data => {
                if (data.uid === this.fid && data.fid === this.user.uid) {
                    this.title = this.$route.query.fid;
                }
            });

            this.socket.on(' close track', data => {
                if (data.uid === this.fid && data.fid === this.user.uid) {
                    this.remoteStream && this.remoteStream.getTracks().forEach(track => {
                        track.stop();
                    });
                    this.localStream && this.localStream.getTracks().forEach(track => {
                        track.stop();
                    });
                }
            });
        },
        sendInfo(data) {
            this.messMainInfo.imgList.push(data);
            this.mainScrollBottom();
        },
        mainScrollBottom() {
            this.$nextTick(() => {
                this.$refs.messMainEl && this.$refs.messMainEl.mainScrollBottom();
            });
        },
        visibBtnHeight() {
            this.$nextTick(() => {
                this.$refs.messInputEl && this.$refs.messInputEl.visibBtnHeight();
            });
        },
        async submit() {
            this.remoteStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    exact: 'user'
                }
            }).catch(err => {
                console.log(err, 2);
            });
            this.remoteRtc = new RTCPeerConnection(this.rtcConfig);

            this.remoteRtc.ontrack = e => {
                const video3 = document.querySelector('#video1');
                video3.srcObject = e.streams[0];
                video3.autoplay = true;
            };
            this.remoteRtc.onicecandidate = e => {
                if (e.candidate) {
                    this.socket.emit('local ice', {
                        uid: this.user.uid,
                        fid: this.fid,
                        ice: JSON.stringify(e.candidate)
                    });
                }
            };
            this.remoteStream.getTracks().forEach(track => {
                this.remoteRtc.addTrack(track, this.remoteStream);
            });
            const video2 = document.querySelector('#video2');
            video2.srcObject = this.remoteStream;
            this.socket.emit('agree', {
                uid: this.user.uid,
                fid: this.fid
            });
        },
        dropped(type) {
            console.log(11);
            this.showVideo = false;
            this.remoteStream && this.remoteStream.getTracks().forEach(track => {
                track.stop();
            });
            this.localStream && this.localStream.getTracks().forEach(track => {
                track.stop();
            });
            this.remoteStream = null;
            this.localStream = null;
            this.telToId = null;
            setTimeout(() => {
                this.userVideo = false;
                this.videoReqStatus = true;
            }, 1000);
            this.socket.emit('dropped', {
                uid: this.user.uid,
                fid: this.fid,
                type
            });
        },
        async turn() {
            if (this.userVideo) {
                const videoTracks = this.localStream.getVideoTracks();
                if (videoTracks.length === 0) {
                    return;
                }
                const currentTrack = videoTracks[0];
                const deviceId = currentTrack.getSettings().deviceId;
                const newDeviceId = await this.findNewDeviceId(deviceId);
                // 停止当前的视频流轨道
                currentTrack.stop();
                const senders = this.localRtc.getSenders();
                const videoSender = senders.find(sender => sender.track.kind === 'video');
                // 获取新的视频流
                this.localStream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: newDeviceId } },
                    audio: true
                });
                const newVideoTrack = this.localStream.getVideoTracks()[0];
                videoSender.replaceTrack(newVideoTrack);
                // 更新本地视频显示
                const videoElement = document.querySelector('#video2');
                videoElement.srcObject = this.localStream;
            }
            else {
                const videoTracks = this.remoteStream.getVideoTracks();
                if (videoTracks.length === 0) {
                    return;
                }
                const currentTrack = videoTracks[0];
                const deviceId = currentTrack.getSettings().deviceId;
                const newDeviceId = await this.findNewDeviceId(deviceId);
                // 停止当前的视频流轨道
                currentTrack.stop();
                const senders = this.remoteRtc.getSenders();
                const videoSender = senders.find(sender => sender.track.kind === 'video');
                // 获取新的视频流
                this.remoteStream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: newDeviceId } },
                    audio: true
                });
                const newVideoTrack = this.remoteStream.getVideoTracks()[0];
                videoSender.replaceTrack(newVideoTrack);
                // 更新本地视频显示
                const videoElement = document.querySelector('#video2');
                videoElement.srcObject = this.remoteStream;
            }
        },
        async findNewDeviceId(currentDeviceId) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            if (videoDevices.length < 2) {
                console.warn('There are no other video devices available.');
                return currentDeviceId;
            }

            const newDevice = videoDevices.find(device => device.deviceId !== currentDeviceId);

            if (newDevice) {
                return newDevice.deviceId;
            }
            console.warn('Failed to find another video device.');
            return currentDeviceId;
        },
        initVideo() {
            this.loading = true;
            const constraints = {
                audio: true,
                video: {
                    exact: 'user'
                }
            };
            navigator.mediaDevices.getUserMedia(constraints).then(async localStream => {
                this.showVideo = true;
                this.userVideo = true;
                this.recodeUser = true;
                this.localRtc = new RTCPeerConnection(this.rtcConfig);
                this.localRtc.ontrack = e => {
                    const video3 = document.querySelector('#video1');
                    video3.srcObject = e.streams[0];
                };
                console.log(this.localRtc, 111);
                this.localRtc.onicecandidate = e => {
                    if (e.candidate) {
                        this.socket.emit('remote ice', {
                            uid: this.user.uid,
                            fid: this.fid,
                            ice: JSON.stringify(e.candidate)
                        });
                    }
                };
                this.localStream = localStream;
                const video1 = document.querySelector('#video2');
                video1.srcObject = localStream;
                // 将音视频流添加到 RTCPeerConnection 对象中
                localStream.getTracks().forEach(async track => {
                    this.localRtc.addTrack(track, localStream);
                });
                this.socket.emit('askAgree', {
                    uid: this.user.uid,
                    fid: this.fid
                });
            }).catch(err => {
                console.log(err, 11);
            }).finally(() => {
                this.loading = false;
            });
        },
        clearStream() {
            this.showVideo = false;
            this.userVideo = false;
            this.recodeUser = false;
            this.remoteStream && this.remoteStream.getTracks().forEach(track => {
                track.stop();
            });
            this.localStream && this.localStream.getTracks().forEach(track => {
                track.stop();
            });
        },
        toFriendInfo() {
            this.$router.push({ path: '/friend/info', query: { fid: this.fid } });
        }
    }
};
</script>

<style lang="less" scoped>
.mainMess {
    height: 100%;
    overflow: auto;
    padding-top: 0.1px;
    box-sizing: border-box;
    background-color: #f8f8f8;
    color: #000;
    display: flex;
    // flex-wrap: wrap;
    flex-direction: column;
    .mask {
        display: flex;
        align-items: center;
        justify-content: center;
        .wrapper {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 20px;
            &-btn {
                margin-right: 15px;
            }
        }
        .video1 {
            width: 300px;
            height: 300px;
            margin-top: 50px;
        }
        .video2 {
            width: 60px;
            height: 60px;
            position: absolute;
            right: 0;
            top: 0;
        }
        .img {
            width: 300px;
            height: 300px;
            border-radius: 20px;
        }
        .turnPhoto {
            position: absolute;
            left: 10px;
            top: 10px;
            width: 20px;
            height: 20px;
        }
    }
}
</style>
