<template>
  <div class="index">
    <el-row>
      <el-col class="main" :span="18">
        <div class="middle">
          <div class="video">{{name}}

            {{loginData.access_token}}
          </div>
        </div>
        <div class="setup">
          <i class="fa fa-cog" @click="settingShow()"></i>
        </div>
      </el-col>
      <el-col class="JoinForm" :span="6">
        <JoinMeeting/>
      </el-col>
    </el-row>

    <Sidebar ref="sidebar"/>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import JoinMeeting from "@/components/JoinMeeting.vue";

export default {
  name: "index",
  data() {
    return {
      name: "webrtc"
    };
  },
  computed: {
    loginData() {
      return this.$store.state.loginData;
    }
  },
  components: {
    Sidebar,
    JoinMeeting
  },
  methods: {
    settingShow() {
      this.$refs.sidebar.settingShow();
    }
  },
  created() {
    console.log("进入index");
  },
  mounted() {
    console.log("index加载完成");
  }
};
</script>
<style>
.main {
  position: fixed;
  height: 100%;
  left: 0;
  top: 0;
}
.JoinForm {
  position: fixed;
  height: 100%;
  right: 0;
  top: 0;
}
.middle {
  height: 100%;
  padding-bottom: 50px;
}
.video {
  height: 100%;
  /* overflow-x: scroll; */
  border-bottom: 1px solid #ccc;
  background: #ccc;
}
.setup {
  height: 50px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 50px;
  background-color: #303847;
}
.setup i{
  font-size: 22px;
  position: absolute;
  top:15px;
  left: 15px;
  color: beige;
  cursor: pointer;
}
</style>