import axios from 'axios';
import { environment } from '../config/environment';
import { tokenService } from '../util/tokenService';
let base = (sessionStorage.getItem('baseUrl') || environment.apiBase) + '/appapi';



//登录
export const loginFormData = params => { return axios.post(`${base}/uc/login`, params); };

//获取用户信息
// export const getUserInfo = params => { return axios.get(`${base}/uc/user/`, { params: params }); };

//退出
export const sureLogoutFn = params => { return axios.post(`${base}/uc/logout`, ''); };



axios.interceptors.request.use(function (config) {
    // 在发起请求请做一些业务处理
    config.headers.common['Authorization'] = tokenService.getToken()
    return config;
}, function (error) {
    // 对请求失败做处理
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // 对响应数据做处理
    return response;
}, function (error) {
    switch (error.response.status) {
        case 401:
            console.log('token无效');
              tokenService.refreshToken(); // 刷新token
            break;
        case 413:
            console.log('token已过期');
              tokenService.refreshToken(); // 刷新token
            break;
        case 500:
            console.log('服务器错误');
            break;
        case 404:
            console.log('找不到api');
            break;
        case 402:
            console.log('服务器异常');
            break;
        default:
            break;
    }
    // // 对响应错误做处理
    return Promise.reject(error);
});