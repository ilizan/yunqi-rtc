console.log('xmpp.js')
import store from '../store.js';
/**************** xmpp连接 开始 ****************/
let XMPPData = {
    conferences: {
        xmppUsername: store.state.loginData.xmppUsername,
        xmppPassword: store.state.loginData.xmppPassword,
        webrtcXmppIp: store.state.loginData.webrtcXmppIp,
        xmppServer: store.state.loginData.xmppServer
    },
    reConnectFlag: false,
    // XMPP服务器BOSH地址
    BOSH_SERVICE: store.state.loginData.webrtcXmppIp + '/http-bind/',
    // 房间JID 1085911
    ROOM_JID: '',
    // XMPP连接
    connection: null,
    // 当前状态是否连接
    connected: false,
    // 当前登录的JID
    jid: store.state.loginData.xmppUsername + '@' + store.state.loginData.xmppServer
};
//是否是被别人踢掉的
let isKicked = false;
let timer = null;
//被叫入会 modal
let CallModal = false;//模态框
let modalTimer = '';//定时器 1分钟后关闭
let roomNum = '';
let hostPin = '';
let conferenceName = '';
let webRTCPath = '';
let _this = '';
export const xmpp = {
    init() {
        _this = this;
        console.log('xmppInit方法被调用');
        _this.loginConnect();
    },
    //重连
    reConnect() {
        XMPPData.reConnectFlag = true;
        console.log(1)
        timer = setInterval(function () {
            if (!XMPPData.connected) {
                _this.loginConnect();
                if (XMPPData.connected) {
                    console.log('重连成功');
                    console.log(timer)
                    clearInterval(timer);
                    timer = null;
                    console.log(timer)
                    return;
                }
            }
        }, 15000);
    },
    // 连接状态改变的事件
    onConnect(status) {
        if (status == Strophe.Status.AUTHFAIL) {
            console.log(`${status}=>`, '登录失败！');
        } else if (status == Strophe.Status.CONNTIMEOUT) {
            console.log(`${status}=>`, '连接超时！');
        } else if (status == Strophe.Status.CONNFAIL) {
            console.log(`${status}=>`, '连接失败！');
        } else if (status == Strophe.Status.AUTHFAIL) {
            console.log(`${status}=>`, '登录失败！');
        } else if (status == Strophe.Status.DISCONNECTING) {
            console.log(`${status}=>`, '连接正在关闭！');
            XMPPData.connected = false;
        } else if (status == Strophe.Status.ERROR) {
            console.log(`${status}=>`, '连接错误！');
            XMPPData.connected = false;
        } else if (status == Strophe.Status.DISCONNECTED) {
            console.log(`${status}=>`, '连接断开！');
            XMPPData.connected = false;
            // this.i == 0 &&
            isKicked = false
            if (!isKicked) {
                _this.reConnect();
            }
            // this.i++;
        } else if (status == Strophe.Status.CONNECTING) {
            console.log(`${status}=>`, '正在连接！');
            XMPPData.connected = false;
        } else if (status == Strophe.Status.CONNECTED) {
            console.log(`${status}=>`, '连接成功，可以开始聊天了！');
            XMPPData.connected = true;
            // 当接收到<message>节，调用onMessage回调函数
            XMPPData.connection.addHandler(_this.onMessage, null, 'message', null, null, null);
            if (XMPPData.reConnectFlag) {
                setTimeout(() => {
                    XMPPData.connection.addHandler(_this.onStream, null, 'stream:error', null, null, null);
                }, 60000);
                // self.getParticipantsFn();
            } else {
                XMPPData.connection.addHandler(_this.onStream, null, 'stream:error', null, null, null);
            }

            // 首先要发送一个<presence>给服务器（initial presence）
            // this.XMPPData.connection.send($pres().tree());
            XMPPData.connection.sendPresence($pres().tree());
            // 发送在线状态
            XMPPData.connection.sendPresence($pres({
                from: XMPPData.jid,
                // to: this.XMPPData.ROOM_JID + "/" + this.XMPPData.jid.substring(0,this.XMPPData.jid.indexOf("@"))
            }).c('status', '2').tree());

            // 发送<presence>元素，加入房间
            // var pres = $pres({
            //     from: this.XMPPData.jid,
            //     to: this.XMPPData.ROOM_JID + "/" + this.XMPPData.jid.substring(0,this.XMPPData.jid.indexOf("@"))
            // }).c('x',{xmlns: 'http://jabber.org/protocol/muc'}).tree();
            // this.XMPPData.connection.send($pres);
            XMPPData.connection.send($pres().c('priority').t('1'));
            // this.XMPPData.connection.sendIQ(pres);//获取房间列表
        }
    },

    // 接收到<message>
    onMessage(msg) {
        console.log(msg);
        // 解析出<message>的from、type属性，以及body子元素
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        if (type == 'groupchat' && elems.length > 0) {
            var body = elems[0];
        } else if (type == 'chat') {
            var body = elems[0];
            var msg = JSON.parse(body.innerHTML);
            if (msg.msgType == 3023) {
                CallModal = true;
                roomNum = msg.msgData.roomNumber;
                hostPin = msg.msgData.password;
                conferenceName = msg.msgData.conferenceName;
                webRTCPath = '?conference=' + roomNum + '&pin=' + hostPin;

                modalTimer = setTimeout(() => {
                    CallModal = false;
                }, 36000);
            }
        }
        return true;
    },
    onStream(msg) {
        console.log('xmpp isKicked', msg);
        isKicked = true;
    },
    // 通过BOSH连接XMPP服务器
    loginConnect() {
        if (!XMPPData.connected) {
            XMPPData.connection = new Strophe.Connection(XMPPData.BOSH_SERVICE);
            XMPPData.connection.connect(XMPPData.conferences.xmppUsername + '@' + XMPPData.conferences.xmppServer + '/uc', XMPPData.conferences.xmppPassword, _this.onConnect);
            XMPPData.jid = XMPPData.conferences.xmppUsername + '@' + XMPPData.conferences.xmppServer;
        } else {

        }
    },
    // 断开xmpp连接
    disConnectXmpp(){
        // this.isKicked = true;
        if (XMPPData.connected) {
            XMPPData.connection.disconnect();
        }
    }
}