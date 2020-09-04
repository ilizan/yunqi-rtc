<template>
  <div class="joinMeeting">
    <div class="joinForm">
      <h2>加入会议</h2>
      <p>
        <el-input v-model="meetingData.mNumber" placeholder="请输入会议号" autocomplete="off"></el-input>
      </p>
      <p>
        <el-input v-model="meetingData.mPassword" show-password placeholder="请输入会议密码" autocomplete="off"></el-input>
      </p>
      <p>
        <el-input v-model="meetingData.mName"></el-input>
      </p>

      <p>
        <el-button @click="joinMeetingFn()" type="primary">加入会议</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "joinMeeting",
  data() {
    return {
      meetingData: {
        mNumber: "",
        mPassword: "",
        mName: "访客xxxx"
      }
    };
  },
  computed: {
    loginData() {
      return this.$store.state.loginData;
    }
  },
  methods: {
    joinMeetingFn() {
      console.log(this.loginData)
      console.log(this.meetingData);
    }
  }
};
</script>

<style lang="scss" scoped>
.joinMeeting{
  height: 100%;
  background: linear-gradient(to bottom, #23384e, #373737);
}
.joinForm {
  margin: 0 auto;
  padding-top: 50px;
  width: 90%;
}
.joinForm h2 {
  text-align: center;
}
.joinForm p {
  margin: 20px 0;
  text-align: center;
}
</style>