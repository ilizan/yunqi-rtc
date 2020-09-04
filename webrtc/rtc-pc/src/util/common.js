import store from '../store.js';
export const common = {

    /* 登录时设置需要本地存储的数据 */
    loginSetData(resData) {
        console.log(resData)
        const expires = resData.expires_in;
        // 登录成功保存 token数据 cookie
        $cookies.set('uc_access_token', resData.access_token); // 请求token
        $cookies.set('uc_expires_in', resData.expires_in, expires); // token有效期
        $cookies.set('uc_token_type', resData.token_type, expires); // token类型
        $cookies.set('uc_refresh_token', resData.refresh_token); // 刷新token
        $cookies.set('uc_realName', resData.realName, expires); // 登录者名称
        $cookies.set('uc_isLogin', 'true', expires); // uc已登陆
        const xmppCookieData = {
            'realName': resData.realName,
            'userId': resData.userId,
            'entId': resData.entId,
            // 'access_token': resData.access_token,
            // 'refresh_token': resData.refresh_token,
            'webrtcAddress': resData.webrtcAddress,
            'webrtcXmppIp': resData.webrtcXmppIp,
            'xmppPassword': resData.xmppPassword,
            'xmppServer': resData.xmppServer,
            'xmppUsername': resData.xmppUsername
        };
        $cookies.set('xmppCookieData', JSON.stringify(xmppCookieData)); // 连接xmpp相关数据
        localStorage.setItem('uc_loginData', JSON.stringify(resData)); // 保存返回信息
        store.commit("setLoginData",resData);

    },

    /* 从localstorage中获取登录的用户信息 */
    getLoginMsg() {
        if (localStorage.getItem('uc_loginData')) {
            return JSON.parse(localStorage.getItem('uc_loginData'));
        }
    },

    deleAllCookie(){
        console.log(1)
    },
    /*
  * 退出登录
  * 删除当前用户登录时所存储的cookie以及localstorage
  * 并返回到登录页面
  */
    deletAllLoginData() {
        this.deleAllCookie();//清除cookies
        localStorage.clear();//清除localStorage
        sessionStorage.clear();//sessionStorage
        store.commit("setLoginData",'');
    }
}