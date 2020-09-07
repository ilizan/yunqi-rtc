## <center>webrtc-git</center>
#### 安装
git clone https://gitee.com/ilizan/webrtc-git.git
##### webrtc-web 谷歌官方demo:[链接](https://codelabs.developers.google.com/codelabs/webrtc-web/#0)
'step-01', 'step-02', 'step-03'为静态页面 <br>'step-04', 'step-05', 'step-06'
需npm i下载依赖
node index.js运行

##### rtc1:
1. cd rtc1
2. npm i 安装依赖
3. node index.js

##### p2p-webrtc:[[演示地址](https://webrtc.laravue.org)]
1. git clone
2. npm i
3. npm run dev  // 启动vue
4. node server.js // 启动 socket.io

---
#### 介绍
1. webrtc api
2. JSSIP
3. 本地node搭建https环境


#### 1.webrtc api
##### getUserMedia()
getUserMedia()：通过MediaStream的API能够通过设备的摄像头及话筒获得视频、音频的同步流

html:
```
<!DOCTYPE html>
<html>
<head>
<title>与WebRTC实时通信</title>
<link rel="stylesheet" href="css/main.css" />
</head>
<body>
<h1>与WebRTC实时通信</h1>
<!-- autoplay 必加 -->
<video autoplay></video>
<script src="js/main.js"></script>
</body>
</html>
```
js:
```
'use strict';//避免常见的编码问题
var constraints = {
video: true//只有视频，默认情况下禁用音频
};
var video = document.querySelector('video');
function handleSuccess(stream) {//getUserMedia()成功
// console.log(stream)
video.srcObject = stream;
// video.src = window.URL.createObjectURL(stream);//地址
console.log(stream.getVideoTracks()[0])
console.log("使用设备："+stream.getVideoTracks()[0].label)
}
function handleError(error) {//获取摄像头失败
console.error('getUserMedia error: ', error);
}
//询问浏览器打开摄像头
navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);
```
##### RTCPeerConnection
RTCPeerConnection：是WebRTC用于构建点对点之间稳定、高效的流传输的组件
作用是在浏览器之间建立数据的“点对点”（peer to peer）通信.

#### 使用RTCPeerConnection流式传输视频
- 获得视频流[mediaStream]
- 允许RTC服务器配置。
- 创建对等连接并添加行为。
1. 创建本地对等连接对象本地连接，连接ice代理
2. 创建远程对等连接对象远程连接，连接ice代理
- 将本地流添加到连接并创建连接。
1. 添加本地流到本地连接。
2. 本地连接创建开始。

html:
```
<video id="localVideo" autoplay></video>
<video id="remoteVideo" autoplay></video>
<div>
<button onclick="startAction()">Start</button>
<button onclick="callAction()">Call</button>
<button onclick="hangupAction()">Hang Up</button>
</div>
```
js:
```
'use strict';
// Set up media stream constant and parameters.
// In this codelab, you will be streaming video only: "video: true".
// Audio will not be streamed because it is set to "audio: false" by default.
const mediaStreamConstraints = {
video: true,
};
// Set up to exchange only video.
const offerOptions = {
offerToReceiveVideo: 1,
};
// Define initial start time of the call (defined as connection between peers).
let startTime = null;
// Define peer connections, streams and video elements.
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let remoteStream;
let localPeerConnection;
let remotePeerConnection;
// Define MediaStreams callbacks.
// Sets the MediaStream as the video element src.
function gotLocalMediaStream(mediaStream) {
localVideo.srcObject = mediaStream;
localStream = mediaStream;
trace('Received local stream.');
// callButton.disabled = false; // Enable call button.
}
// Handles error by logging a message to the console.
function handleLocalMediaStreamError(error) {
trace(`navigator.getUserMedia error: ${error.toString()}.`);
}
// Handles remote MediaStream success by adding it as the remoteVideo src.
function gotRemoteMediaStream(event) {
const mediaStream = event.stream;
remoteVideo.srcObject = mediaStream;
remoteStream = mediaStream;
trace('Remote peer connection received remote stream.');
}
// Add behavior for video streams.
// Logs a message with the id and size of a video element.
function logVideoLoaded(event) {
const video = event.target;
trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
`videoHeight: ${video.videoHeight}px.`);
}
// Logs a message with the id and size of a video element.
// This event is fired when video begins streaming.
function logResizedVideo(event) {
logVideoLoaded(event);
if (startTime) {
const elapsedTime = window.performance.now() - startTime;
startTime = null;
trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
}
}
localVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('onresize', logResizedVideo);
// Define RTC peer connection behavior.
// 连接新的ice候选人。
function handleConnection(event) {
const peerConnection = event.target;
const iceCandidate = event.candidate;
if (iceCandidate) {
const newIceCandidate = new RTCIceCandidate(iceCandidate);
const otherPeer = getOtherPeer(peerConnection);
otherPeer.addIceCandidate(newIceCandidate)
.then(() => {
handleConnectionSuccess(peerConnection);
}).catch((error) => {
handleConnectionFailure(peerConnection, error);
});
trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
`${event.candidate.candidate}.`);
}
}
// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};
// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
`${error.toString()}.`);
}
// Logs changes to the connection state.
function handleConnectionChange(event) {
const peerConnection = event.target;
console.log('*：', event);
trace(`${getPeerName(peerConnection)} ICE state: ` +
`${peerConnection.iceConnectionState}.`);
}
// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
trace(`Failed to create session description: ${error.toString()}.`);
}
// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
const peerName = getPeerName(peerConnection);
trace(`${peerName} ${functionName} complete.`);
}
// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
setDescriptionSuccess(peerConnection, 'setLocalDescription');
}
// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}
// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description) {
trace(`本地连接信息:\n${description.sdp}`);
trace('本地连接开始.');
localPeerConnection.setLocalDescription(description)
.then(() => {
setLocalDescriptionSuccess(localPeerConnection);
}).catch(setSessionDescriptionError);
trace('远程连接开始.');
remotePeerConnection.setRemoteDescription(description)
.then(() => {
setRemoteDescriptionSuccess(remotePeerConnection);
}).catch(setSessionDescriptionError);
trace('远程连接创建应答启动');
remotePeerConnection.createAnswer()
.then(createdAnswer)
.catch(setSessionDescriptionError);
}
// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
trace(`Answer from remotePeerConnection:\n${description.sdp}.`);
trace('remotePeerConnection setLocalDescription start.');
remotePeerConnection.setLocalDescription(description)
.then(() => {
setLocalDescriptionSuccess(remotePeerConnection);
}).catch(setSessionDescriptionError);
trace('localPeerConnection setRemoteDescription start.');
localPeerConnection.setRemoteDescription(description)
.then(() => {
setRemoteDescriptionSuccess(localPeerConnection);
}).catch(setSessionDescriptionError);
}
// Define and add behavior to buttons.
// Define action buttons.
// const startButton = document.getElementById('startButton');
// const callButton = document.getElementById('callButton');
// const hangupButton = document.getElementById('hangupButton');
// Set up initial action buttons status: disable call and hangup.
// callButton.disabled = true;
// hangupButton.disabled = true;
// Handles start button action: creates local MediaStream.
function startAction() {
// startButton.disabled = true;
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
.then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
trace('Requesting local stream.');
}
// Handles call button action: creates peer connection.
function callAction() {
// callButton.disabled = true;
// hangupButton.disabled = false;
// trace('Starting call.');
// startTime = window.performance.now();
// Get local media stream tracks.
const videoTracks = localStream.getVideoTracks();
const audioTracks = localStream.getAudioTracks();
if (videoTracks.length > 0) {
trace(`使用视频设备： ${videoTracks[0].label}.`);
}
if (audioTracks.length > 0) {
trace(`使用视频设备： ${audioTracks[0].label}.`);
}
const servers = null; // 允许RTC服务器配置。
//创建对等连接并添加行为。
localPeerConnection = new RTCPeerConnection(servers);
trace('创建本地对等连接对象本地连接。');
localPeerConnection.addEventListener('icecandidate', handleConnection);//连接ice代理
localPeerConnection.addEventListener(
'iceconnectionstatechange', handleConnectionChange);
remotePeerConnection = new RTCPeerConnection(servers);
trace('创建远程对等连接对象远程连接.');
remotePeerConnection.addEventListener('icecandidate', handleConnection);//连接ice代理
remotePeerConnection.addEventListener(
'iceconnectionstatechange', handleConnectionChange);
remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);
//将本地流添加到连接并创建连接的要约。
localPeerConnection.addStream(localStream);
trace('添加本地流到本地连接。');
trace('本地连接创建开始。');
localPeerConnection.createOffer(offerOptions)
.then(createdOffer).catch(setSessionDescriptionError);
}
// Handles hangup action: ends up call, closes connections and resets peers.
function hangupAction() {
localPeerConnection.close();
remotePeerConnection.close();
localPeerConnection = null;
remotePeerConnection = null;
// hangupButton.disabled = true;
// callButton.disabled = false;
trace('Ending call.');
}
// Add click event handlers for buttons.
// startButton.addEventListener('click', startAction);
// callButton.addEventListener('click', callAction);
// hangupButton.addEventListener('click', hangupAction);
// Define helper functions.
// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
return (peerConnection === localPeerConnection) ?
remotePeerConnection : localPeerConnection;
}
// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
return (peerConnection === localPeerConnection) ?
'localPeerConnection' : 'remotePeerConnection';
}
// Logs an action (text) and the time when it happened on the console.
function trace(text) {
text = text.trim();
const now = (window.performance.now() / 1000).toFixed(3);
console.log(now, text);
}

```
---
#### 2.JSSIP
##### 创建一个JsSIP用户代理
用户代理配置
JsSIP用户代理需要一个配置对象来进行初始化。有一些必需的配置参数和许多可选的参数。检查完整的配置参数列表。
```
var socket = new JsSIP.WebSocketInterface('wss://sip.myhost.com');
var configuration = {
  sockets  : [ socket ],
  uri      : 'sip:alice@example.com',
  password : 'superpassword'
};
```
用户代理实例
```
var coolPhone = new JsSIP.UA(configuration);
```
[官方api](http://www.jssip.net/documentation/)
[在线demo](https://ilizan.github.io/jssip/)



#### 3. 本地node搭建https环境
