<template>
  <div class="loginPage">
    <div v-if="!loginData" class="loginForm">
      <p>
        <el-input v-model="loginForm.username" placeholder="登录账户为邮箱/手机号"></el-input>
      </p>
      <p>
        <el-input v-model="loginForm.password" show-password placeholder="密码"></el-input>
      </p>
      <label class="loginMsg">{{loginMsg}}</label>
      <p>
        <el-button @click="loginSubmit()" type="primary">登录</el-button>
      </p>
    </div>
    <div v-if="loginData" class="userInfo">
      <div class="textItem">
        <label>姓名</label>
        <span>{{loginData.realName}}</span>
      </div>
      <div class="textItem">
        <label>公司/单位</label>
        <span>{{loginData.entName}}</span>
      </div>
    </div>
    <div v-if="loginData" class="logout">
      <el-button type="danger" plain @click="logoutFn()">退出</el-button>
    </div>
  </div>
</template>

<script>
import { loginFormData, getUserInfo, sureLogoutFn } from "../../api/api.js";
import { common } from "../../util/common.js";
export default {
  name: "loginPage",
  data() {
    return {
      loginForm: {
        captcha: "",
        username: "zhupp@svocloud.com",
        password: "123456",
        clientSecret:
          "MIICXQIBAAKBgQCxwfRs7dncpWJ27OQ9rIjHeBbkaigRY4in+DEKBsbmT3lpb2C6JQyqgxl9C+l5zSbONp0OIibaAVsLPSbUPVwIDAQABAoGAK76VmKIuiI2fZJQbdq6oDQ",
        isKeepLogin: true
      },
      loginMsg: "",
      loginData: ""
    };
  },
  methods: {
    loginSubmit() {
      var that = this;
      console.log(1)
      
      loginFormData(this.loginForm)
        .then(res => {
          let { code, data, msg } = res.data;
          if (code == 200) {
            //保存user信息
            common.loginSetData(data);
            this.$message({
              message: "登录成功",
              type: "success"
            });
            that.loginMsg = "";
            this.$router.push('/index')
          }
        })
        .catch(error => {
          let { msg } = error.response.data;
          that.loginMsg = msg;
        });
    },
    logoutFn() {
      this.$confirm("您确定要退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sureLogoutFn();
        })
        .catch(() => {});
    },
    // 确定退出登录logout
    sureLogoutFn() {
      sureLogoutFn()
        .then(res => {
          let { code } = res.data;
          if (code == 200) {
              common.deletAllLoginData()//清除所有登录信息
              this.$message({
              message: "退出成功",
              type: "success"
            });
              this.$router.push('/index')
          }
        })
        .catch(error => {
          let { msg } = error.response.data;
          console.log(msg);
        });
    }
  },
  mounted() {
    this.loginData = common.getLoginMsg();
  }
};
</script>

<style lang="scss" scoped>
.loginForm {
  margin: 0 auto;
  margin-top: 50px;
  width: 90%;
}
.loginForm p {
  margin: 30px 0 5px;
  text-align: center;
}
.loginMsg {
  color: red;
}
.userInfo {
  margin-left: 20px;
}
.userInfo .textItem {
  font-size: 16px;
  line-height: 45px;
}
.userInfo .textItem label {
  width: 100px;
  display: inline-block;
}
.logout {
  padding-top: 20px;
  text-align: center;
}
</style>