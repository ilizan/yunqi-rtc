<template>
  <div class="Sidebar">
    <Drawer width="30%" title="设置" placement="left" :closable="true" v-model="setting">
      <ul class="left_menu">
        <li @click="twoSidebarShow('login')">
          <template v-if="!loginData">
            <i class="fa fa-user"></i>未登录
          </template>
          <template v-if="loginData">
            <i class="fa fa-user"></i>{{loginData.realName}}
          </template>
        </li>
        <li @click="twoSidebarShow('video')">
          <i class="fa fa-video-camera"></i>视频
        </li>
        <li @click="twoSidebarShow('audio')">
          <i class="fa fa-microphone"></i>音频
        </li>
        <li @click="twoSidebarShow('definition')">
          <i class="fa fa-rss"></i>呼叫速率
        </li>
        <li @click="twoSidebarShow('server')">
          <i class="fa fa-cogs"></i>设置服务器
        </li>
      </ul>
    </Drawer>
    <Drawer
      width="30%"
      :title="twoTitle"
      placement="left"
      :closable="true"
      v-model="twoShow"
      :mask-closable="true"
      @on-close="hideTwo()"
    >
      <!-- <Login ref="login" :loginShowAfter="loginShowAfter"/> -->
      <router-view/>
      <div class="back">
        <i class="fa fa-arrow-left" @click="hideTwo()"></i>
      </div>
    </Drawer>
  </div>
</template>

<script>
// import Login from "./Login.vue";
import VueCookies from "vue-cookies";
import { common } from "../util/common.js";
export default {
  name: "Sidebar",
  props: {},
  data() {
    return {
      setting: false,
      twoShow: false,
      loginData: common.getLoginMsg(),
      twoTitle: ""
    };
  },
  methods: {
    settingShow() {
      this.setting = true;
    },
    twoSidebarShow(name) {
      switch (name) {
        case "login":
          (this.loginData = common.getLoginMsg()),
            !this.loginData
              ? (this.twoTitle = "登陆")
              : (this.twoTitle = "个人信息");
          break;
        case "video":
          this.twoTitle = "视频设置";
          break;
        case "audio":
          this.twoTitle = "音频设置";
          break;
        case "definition":
          this.twoTitle = "呼叫速率";
          break;
        case "server":
          this.twoTitle = "设置服务器";
          break;
        default:
          break;
      }
      this.twoShow = true;
      this.$router.push("/index/" + name);
    },

    //隐藏二级目录
    hideTwo() {
      this.$router.push("/index");
    }
  },
  watch: {
    $route(now, old) {
      //监控路由变换，控制二级目录的显示
      if (now.path == "/index") {
        this.twoShow = false;
        this.loginData = common.getLoginMsg();
      }
    }
  },
  created() {
    console.log("进入sidebar");
  },
  mounted() {
    console.log("左侧路由加载完成");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
  list-style-type: none;
}
.left_menu li {
  font-size: 16px;
  line-height: 45px;
  padding-left: 20px;
}
.left_menu li:hover {
  cursor: pointer;
  background-color: #303847;
}
.left_menu li i {
  margin-right: 5px;
  font-size: 18px;
  width: 20px;
}
.back {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}
.back i {
  font-size: 20px;
  margin: 5px 5px 5px 15px;
  padding: 5px 8px;
  cursor: pointer;
}
</style>
