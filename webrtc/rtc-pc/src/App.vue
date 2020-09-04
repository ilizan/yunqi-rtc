<template>
  <div id="app">
    <router-view/>
    jianting
  </div>
</template>

<style lang="scss">
#app {
  color: #fff;
}
div.ivu-drawer-content {
  background-color: #3f4a5d;
  color: #fff;
}
div.ivu-drawer-header-inner {
  color: #fff;
}
div.ivu-drawer-header {
  border-bottom: 1px solid #535c65;
}
input[type="text"],
input[type="password"] {
  background-color: transparent;
  color: #fff;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #949898;
}
input[type="text"]:hover,
input[type="text"]:focus,
input[type="password"]:hover,
input[type="password"]:focus {
  border-bottom: 1px solid #949898;
}
a.ivu-drawer-close .ivu-icon-ios-close{
  top: 0px;
}
i.ivu-icon-ios-close:before{
  background-color: #fff;
  border-radius: 50%;
  
}
</style>
<script>
import { xmpp } from "./util/xmpp.js";
export default {
  name:'app',
  data() {
    return {
      key: 'value'
    }
  },
  methods: {
    fn() {
      
    }
  },
  mounted () {
    xmpp.init();
  },
};
</script>
